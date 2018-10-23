import "es6-shim"
import * as React from 'react'
import { render } from "react-dom"
import "./reset.css"
import "antd-mobile/es/input-item/style/index.css"
import toast from "antd-mobile/es/toast"
import "antd-mobile/es/toast/style/index.css"
import Carousel from "antd-mobile/es/carousel"
import "antd-mobile/es/carousel/style/index.css"
import Modal from "antd-mobile/es/modal"
import "antd-mobile/es/modal/style/index.css"
import "./index.less"

const CART_BOOK_KEY = "cart_book";

interface ICartItem {
    index: number;
    isDigital: boolean;
    count: number;
}

interface ITextProps {
    title: string;
    text: string;
}


class TextDetail extends React.Component<ITextProps, {
    isExtend: boolean;
}> {
    constructor(props: ITextProps) {
        super(props);
        this.state = {
            isExtend: false,
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState({
            isExtend: !this.state.isExtend
        });
    }


    render() {
        const { title, text } = this.props;
        const { isExtend } = this.state;
        return (
            <div className="introduce-wrap">
                <h5 className="text-title">{title}</h5>
                <p className={`text-detail ${!isExtend ? "multilineEllipies": ""}`}>{text}</p>
                <div style={{textAlign: "right", fontSize: "12px", marginTop: "5px"}}>
                    <a onClick={this.handleClick} className="text-btn">
                        {isExtend ? "收起" : "展开"}
                        <i className={`text-btn-icon ${isExtend ? "text-btn-icon-up" : ""}`}></i>
                    </a>
                </div>
            </div>
        )
    }
}


class MiguTest extends React.Component<{}, {
    isDigital: boolean;
    isShowModal: boolean;
    index: number;
    cartBooks: Map<number, ICartItem>;
}> {
    imgs: string[] = ["../images/cover01.png", "../images/cover02.png","../images/cover03.png", "../images/cover04.png"];
    books: string[] = ["时运变迁", "植物学家的筷子和银针", "秘密实践版", "超越无穷大"];
    prices: number[] = [20, 30, 50, 60];
    h_prices: number[] = [50, 60, 80, 90];

    constructor(props: any) {
        super(props);
        let savedCartBook: Map<number, ICartItem> = new Map();
        
        try {
            const savedCartBook_str = localStorage.getItem(CART_BOOK_KEY);
            if (savedCartBook_str) {
                const books: ICartItem[] = JSON.parse(savedCartBook_str);
                books.forEach((book: ICartItem, i: number) => {
                    savedCartBook.set(book.index, book);
                });
            }
        } catch(e) {
            console.error(e);
        }
        
        this.state = {
            isDigital: true,
            isShowModal: false,
            index: 0,
            cartBooks: savedCartBook,
        }

        this.handleDClick = this.handleDClick.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.handleSwipe = this.handleSwipe.bind(this);
        this.removeFromCart = this.removeFromCart.bind(this);
    }

    handleDClick(isDigital: boolean) {
        this.setState({
            isDigital
        })
    }

    showModal() {
        this.setState({
            isShowModal: true
        });
    }

    hideModal() {
        this.setState({
            isShowModal: false,
        })
    }

    addToCart() {
        const { index, isDigital, cartBooks } = this.state
        let item: ICartItem | undefined = cartBooks.get(index);

        if (item) {
            item.count += 1;
        } else {
            item = {
                index,
                isDigital,
                count: 1
            };
            cartBooks.set(index, item);
        }

        this.forceUpdate();
        this.saveCartBook();
    }

    removeFromCart(index: number) {
        const { cartBooks } = this.state;
        cartBooks.delete(index);
        this.forceUpdate();
        this.saveCartBook();
    }

    saveCartBook() {
        const { cartBooks } = this.state;
        localStorage.setItem(CART_BOOK_KEY, JSON.stringify([...cartBooks.values()]));
    }

    handleSwipe(index: number) {
        this.setState({
            index
        });
    }

    addToSj() {
        toast.info("加入书架成功", 5);
    }

    render() {
        const { isDigital, index, cartBooks} = this.state;
        const imgs = this.imgs;
        const books = this.books;
        return (
            <div className="container">
                <div className="first-part">
                    <Carousel
                        autoplayInterval={2000}
                        infinite
                        dots={false}
                        afterChange={this.handleSwipe}
                        selectedIndex={index}
                    >
                        {imgs.map((e, index) => {
                            return (
                                <div className="book-wrap" key={e}>
                                    <img className="miju-img" src={e}/>
                                </div>
                            );
                        })}
                    </Carousel>
                    <div className="dot-wrap">
                        {imgs.map((e, i) => {
                            return <i key={e} className={`dot ${i === index ? "dot-active" : ""}`}></i>
                        })}
                    </div>
                    <h3 className="book-title">{books[index]}</h3>
                    <h5 className="book-author">[美]保罗</h5>
                    <div className="miju-tt-wrap">
                        <div onClick={() => this.handleDClick(true)} className={`miju-tt ${isDigital ? "miju-tt-active" : ""}`}>电子书</div>
                        <div onClick={() => this.handleDClick(false)} className={`miju-tt ${isDigital ? "" : "miju-tt-active"}`}>精品书</div>
                    </div>
                    <h5 className="book-price">¥{isDigital ? this.prices[index] : this.h_prices[index]}</h5>
                </div>
                <TextDetail title="图书简介" text="Kimi Raikkonen's second stint at Ferrari has been characterised by dropping the ball at key moments and costing himself chances to win races. At Austin he passed every test to end a wait of more than 100 races to return to the top of the podium."/>
                <TextDetail title="媒体推荐" text="Kimi Raikkonen's second stint at Ferrari has been characterised by dropping the ball at key moments and costing himself chances to win races. At Austin he passed every test to end a wait of more than 100 races to return to the top of the podium."/>
                <div className="cart-wrap">
                    <div className="cart" onClick={this.showModal}>
                        {cartBooks.size > 0 ? <i className="cart-num">{cartBooks.size}</i> : null}
                    </div>
                    <div className="addToSj" onClick={this.addToSj}>加入书架</div>
                    <div className="addToCart" onClick={this.addToCart}>加购物车</div>
                </div>
                <Modal
                    popup
                    visible={this.state.isShowModal}
                    animationType="slide-up"
                    onClose={this.hideModal}
                >
                    <div className="cart-modal-wrap">
                        {!cartBooks.size ? <h1 className="cart-empty">Empty</h1> : [...cartBooks.values()].map((item: ICartItem, i) => {
                            const { index, isDigital}  = item;
                            const price = isDigital ? this.prices[index] : this.h_prices[index];
                            return (
                                <div key={index} className="cart-item-wrap">
                                    <img src={imgs[index]} className="cart-img"/>
                                    <div className="cart-item-info">
                                        <h5>{books[index]}</h5>
                                        <h3>¥{price}</h3>
                                    </div>
                                    <a className="cart-item-del" onClick={() => {
                                        this.removeFromCart(index);
                                    }}>删除</a>
                                </div>
                            )
                        })}
                    </div>
                </Modal>
            </div>
        )
    }
}





render(<MiguTest />, document.getElementById("root"));