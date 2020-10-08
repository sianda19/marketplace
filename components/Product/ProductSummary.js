// import moduleName from ''
import { useState } from 'react';
import { Item, Label, Image, Button, Icon } from 'semantic-ui-react';
import AddProductToCart from '../Product/AddProductToCart';
import ImagesSlider from '../Slider/ImagesSlider';
import { useRouter } from 'next/router';
import catchErrors from '../../utils/catchErrors';
import baseUrl from '../../utils/baseUrl';
import axios from 'axios';
import cookie from 'js-cookie';

function ProductSummary({ user, product }) {
  const { name, mediaUrls, _id, price, sku } = product;
  const [loading, setLoading] = React.useState(false);
  const [counter, setCounter] = useState(product.wantCounter);
  const router = useRouter();

  const handleAddProductToSavedItems = async () => {
    const isUser = Object.keys(user).length;
    if (!isUser) {
      return router.push('/signup');
    }
    try {
      setLoading(true);
      const url = `${baseUrl}/api/saved`;
      const payload = { productId: _id };
      const token = cookie.get('token');
      const headers = { headers: { Authorization: token } };
      const response = await axios.put(url, payload, headers);
      if (response.status == 200) {
        setCounter((prevCounter) => prevCounter + 1);
      }
    } catch (error) {
      catchErrors(error, window.alert);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Item.Group>
      <Item>
        <Item.Image className="maxHeight100">
          <ImagesSlider imageUrls={mediaUrls} />
        </Item.Image>
        <Item.Content>
          <Item.Header>{name}</Item.Header>
          <Item.Description>
            <p>${price}</p>
          </Item.Description>

          <Item.Extra>
            <Button as="div" labelPosition="right">
              <Button
                color="red"
                onClick={handleAddProductToSavedItems}
                loading={loading}
              >
                <Icon name="heart" />
                want
              </Button>
              <Label as="a" basic color="red" pointing="left">
                {counter}
              </Label>
            </Button>
          </Item.Extra>
          <Item.Extra>
            <Label
              as="a"
              content={product.user.name}
              image={{
                src: product.user.profilePictureUrl,
                spaced: 'right',
                avatar: true,
              }}
            />
          </Item.Extra>
        </Item.Content>
      </Item>
    </Item.Group>
  );
}

export default ProductSummary;
