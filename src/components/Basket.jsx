import React, { Fragment, useState } from 'react';
import axios from 'axios';

import InfoBasket from './InfoBasket';

// import { AppConxtext } from '../App';

import { useCard } from '../hooks/useCard';

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Basket({ onClose, onRemoveItem, opened, isBlockScroll }) {
  const { cardItems, setCardItems, totalPrice } = useCard();
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onClickOrder = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        'https://618fa890f6bf4500174849c9.mockapi.io/order',
        { items: cardItems }
      );
      setOrderId(data.id);
      setIsOrderComplete(true);
      setCardItems([]);
    } catch (err) {
      alert('Не удалось создать заказ');
    }
    setIsLoading(false);
  };

  const blockScrollCloseBasket = () => {
    isBlockScroll();
    onClose();
  };

  return (
    <Fragment>
      <div
        className={`overlay ${opened ? 'overlay_visible' : 'overlay_hidden'}`}
      >
        <div className={`basket ${opened ? 'basket_transform' : ' '}`}>
          <div className="basket__inner">
            <h3 className="basket__title">Корзина</h3>
            <img
              className="basket__close"
              width={32}
              height={32}
              src="/img/basket/close.svg"
              alt="close"
              onClick={blockScrollCloseBasket}
            />

            {cardItems.length > 0 ? (
              <div className="basket__items">
                {cardItems.map((obj) => (
                  <div className="basket__item">
                    <img
                      className="basket__image"
                      width={90}
                      height={70}
                      src={obj.imageUrl}
                      alt="nam270"
                    />
                    <div className="basket__info">
                      <div className="basket__text">{obj.title}</div>
                      <div className="basket__price">{obj.price} руб.</div>
                    </div>
                    <img
                      className="basket__delete"
                      width={11}
                      height={11}
                      src="/img/basket/delete.svg"
                      alt="delete"
                      onClick={() => onRemoveItem(obj.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <InfoBasket
                title={isOrderComplete ? 'Заказ оформлен!' : 'Корзина пустая'}
                description={
                  isOrderComplete
                    ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке`
                    : 'Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ.'
                }
                img={
                  isOrderComplete
                    ? '/img/basket/complete-order.png'
                    : '/img/basket/empty-basket.png'
                }
                onCloseCard={onClose}
                isBlockScroll={isBlockScroll}
              />
            )}
            {cardItems.length > 0 ? (
              <div className="basket__order">
                <div className="basket__block-total">
                  <div className="basket__text basket__text_size_m">Итого:</div>
                  <div className="basket__band"></div>
                  <div className="basket__price basket__price_size_m">
                    {totalPrice} руб.
                  </div>
                </div>
                <div className="basket__block-tax">
                  <div className="basket__text basket__text_size_m">
                    Налог 5%:
                  </div>
                  <div className="basket__band"></div>
                  <div className="basket__price basket__price_size_m">
                    {Math.floor((totalPrice / 100) * 5)} руб.
                  </div>
                </div>
                <button
                  disabled={isLoading}
                  className="basket__button"
                  onClick={onClickOrder}
                >
                  Оформить заказ
                  <img
                    className="basket__arrow--right"
                    width={13}
                    height={12}
                    src="/img/basket/arrow-right.svg"
                    alt="arrow-r"
                  />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Basket;
