import React, { useContext } from 'react';
import {
  Header,
  Segment,
  Button,
  Icon,
  Item,
  Message,
} from 'semantic-ui-react';
import { useRouter } from 'next/router';
import { UserContext } from '../../utils/UserProvider';
import Skeleton from 'react-loading-skeleton';

function CartItemList({ products, handleRemoveFromCart, success, loading }) {
  const { user } = useContext(UserContext);
  const router = useRouter();

  function mapCartProductsToItems(products) {
    return products.map((p) => ({
      childkey: p.product._id,
      header: (
        <Item.Header as="a" onClick={() => router.push(`/${p.product._id}`)}>
          {p.product.name}
        </Item.Header>
      ),
      image: p.product.mediaUrls[0],
      meta: `${p.quantity} × $${p.product.price}`,
      fluid: 'true',
      extra: (
        <Button
          basic
          icon="remove"
          floated="right"
          onClick={() => handleRemoveFromCart(p.product._id)}
        />
      ),
    }));
  }

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <div>
          <Skeleton height={150} width={150} />
        </div>
        <div
          style={{
            fontSize: 20,
            lineHeight: 2,
            width: '100%',
            marginLeft: '1em',
          }}
        >
          <Skeleton count={4} />
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <Message
        success
        header="Success!"
        content="Your order and payment has been accepted"
        icon="star outline"
      />
    );
  }

  if (products.length === -0) {
    return (
      <Segment secondary color="teal" inverted textAlign="center" placeholder>
        <Header icon>
          <Icon name="shopping basket" />
          No products in your cart. Add some!
        </Header>
        <div>
          {Object.keys(user).length ? (
            <Button color="orange" onClick={() => router.push('/')}>
              View Proucts
            </Button>
          ) : (
            <Button color="blue" onClick={() => router.push('/login')}>
              Login to Add Products
            </Button>
          )}
        </div>
      </Segment>
    );
  }
  return <Item.Group items={mapCartProductsToItems(products)} />;
}

export default CartItemList;
