import "./styles.scss";

import * as React from "react";
import GroceryItemUI from "../../../components/grocery-item";
import GroceryItemStore from "client/data/grocery-item-store";
import CartStore from "client/data/cart-store";

interface ICategoryRowProps {
  groceryItemStore: GroceryItemStore;
  cartStore: CartStore;
  categoryName: string;
  className: string;
}

interface ICategoryRowState {
  groceryItems: IGroceryItem[];
}

class CategoryRow extends React.Component<
  ICategoryRowProps,
  ICategoryRowState
> {
  private itemUpdateListener: () => void;
  constructor() {
    super(...arguments);
    this.state = {
      groceryItems: []
    };
  }
  _changeGroceryItems() {
    this.props.groceryItemStore
      .itemsForCategory(this.props.categoryName)
      .then((groceryItems: IGroceryItem[]) => {
        this.setState({ groceryItems });
      });
  }
  componentDidMount() {
    this._changeGroceryItems();
    this.itemUpdateListener = () => {
      this._changeGroceryItems();
    };
    this.props.groceryItemStore.itemListeners.register(this.itemUpdateListener);
    this.props.groceryItemStore.updateItemsForCategory(
      this.props.categoryName,
      10
    );
  }

  componentWillUnmount() {
    this.props.groceryItemStore.itemListeners.unregister(
      this.itemUpdateListener
    );
  }

  render() {
    const itemPieces = this.state.groceryItems.map(item => (
      <GroceryItemUI
        cartStore={this.props.cartStore}
        key={item.id}
        item={item}
      />
    ));
    return (
      <li className="CategoryRow">
        <h2 className="category-name">{this.props.categoryName}</h2>
        <ul className="grocery-item-list">
          {itemPieces}
          <li className="GroceryItem mui-panel">
            <h4 className="item-name">Click For More</h4>
            <span className="click-for-more">
              <img
                src={`/images/fallback-${this.props.categoryName.toLowerCase()}.png`}
                alt="frozen food"
                className="item-image"
              />
            </span>
          </li>
        </ul>
      </li>
    );
  }
}

export default CategoryRow;
