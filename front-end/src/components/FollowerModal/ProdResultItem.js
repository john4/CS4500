'use es6';

import React, { Component } from 'react';
import './ProdResultItem.css';
import '../User/User.css';

class ProdResultItem extends Component {
    render() {
      const {genre, name, photoUrl, userId, isAlreadySent, onClickProd} = this.props;
      const alreadySentClass = isAlreadySent ? "sent" : "";
      const onClick = !isAlreadySent ? () => onClickProd(userId) : () => undefined;

      return (
        <li>
          <div className={`ProdResultItem ${alreadySentClass}`} onClick={onClick}>
            <div className="ProdResultItem-image">
              <img className="UserImage" src={photoUrl} />
            </div>
            <div className="ProdResultItem-body">
              <b>{name}</b>
              <p>Likes: {genre}</p>
            </div>
            <div className="ProdResultItem-icon">
              {isAlreadySent ? <i className="fas fa-2x fa-check"></i> : <i className="fas fa-2x fa-share"></i>}
            </div>
          </div>
        </li>
      );
    }
  }

  export default ProdResultItem;