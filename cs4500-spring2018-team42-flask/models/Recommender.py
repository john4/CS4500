""" RECOMMENDER """

import pandas as pd

from app import DB
from bson.objectid import ObjectId
from collections import defaultdict
from scipy.spatial.distance import euclidean, pdist, squareform


class Recommender(object):
    """
    Recommender utilities
    """

    @staticmethod
    def get_recommended_movies_for_user(user_id):
        def similarity(u, v):
            return 1 / (1 + euclidean(u, v))

        user = DB.User.find_one({'_id': ObjectId(user_id)})
        all_reviews = list(DB.Review.find({}))
        all_movies_reviewed = set([review.get('tmdb_id') for review in all_reviews])

        movies_reviewed_by_user = [review.get('tmdb_id')
            for review in all_reviews if review.get('user_id') == user_id]

        if not movies_reviewed_by_user:
            return [], 200

        movies_reviewed_but_not_by_user = list(set([review.get('tmdb_id')
            for review in all_reviews if not review.get('tmdb_id') in movies_reviewed_by_user]))

        who_reviewed_what = defaultdict(list)  # movie_id: list of users who reviewed
        user_ratings_dict = {}  # user_id: {tmdb_id: rating}

        for review in all_reviews:
            tmdb_id = review.get('tmdb_id')
            rating = review.get('rating')
            review_user_id = review.get('user_id')

            who_reviewed_what[tmdb_id].append(review_user_id)

            previous_user_list = user_ratings_dict.get(review_user_id)
            if previous_user_list:
                user_ratings_dict[review_user_id][tmdb_id] = rating
            else:
                user_ratings_dict[review_user_id] = {tmdb_id: rating}

        def find_movie_similarity(movie_one_id, movie_two_id):
            movie_one_ratings = []
            movie_two_ratings = []

            movie_one_reviewed_by = who_reviewed_what.get(movie_one_id)
            movie_two_reviewed_by = who_reviewed_what.get(movie_two_id)

            relevant_users = list(set(movie_one_reviewed_by) & set(movie_two_reviewed_by))
            if not relevant_users:
                return 0

            user_rating_df_dict = {
                user_id: [user_ratings_dict[user_id][movie_one_id], user_ratings_dict[user_id][movie_two_id]] for user_id in relevant_users
            }

            DF_var = pd.DataFrame.from_dict(user_rating_df_dict)
            DF_var.index = [movie_one_id, movie_two_id]

            dists = pdist(DF_var, similarity)
            DF_euclid = pd.DataFrame(squareform(dists), columns=DF_var.index, index=DF_var.index)
            return DF_euclid.values[0][1]

        movie_similarities = {}  # (movie_one, movie_two): similarity rating
        for movie_one in movies_reviewed_by_user:
            for movie_two in movies_reviewed_but_not_by_user:
                movie_similarities[(movie_one, movie_two)] = find_movie_similarity(movie_one, movie_two)

        user_recommendations = []  # (tmdb_id, estimated_rating)
        for movie in movies_reviewed_but_not_by_user:
            numerator = 0
            denominator = 0

            for movie_rated in movies_reviewed_by_user:
                s = movie_similarities[(movie_rated, movie)]
                numerator += user_ratings_dict[user_id][movie_rated] * s
                denominator += s

            user_recommendations.append((movie, numerator / denominator))

        user_recommendations.sort(key=lambda tup: tup[1], reverse=True)
        movies_to_recommend = [tup[0] for tup in user_recommendations]
        return movies_to_recommend, 200
