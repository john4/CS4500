'use es6';

import React, { Component } from 'react';
import './ProdResultItem.css';
import '../User/User.css';

class ProdResultItem extends Component {
    render() {
      const {genre, name, photoUrl, userId, isAlreadySent, onClickProd} = this.props;
      const alreadySentClass = isAlreadySent ? "sent" : "";
      const onClick = !isAlreadySent ? () => onClickProd() : () => undefined;

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
          </div>
        </li>
      );
    }
  }

  export default ProdResultItem;