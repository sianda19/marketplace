import React, { useState, useEffect } from 'react';
import {
  Input,
  TextArea,
  Button,
  Message,
  Header,
  Icon,
  Form,
  Segment,
} from 'semantic-ui-react';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import catchErrors from '../utils/catchErrors';
import uploadImage from '../utils/uploadImage';
import cookie from 'js-cookie';
import ImagesForm from '../components/Create/ImagesForm';
const INITIAL_PRODUCT = {
  name: '',
  price: '',
  media: [],
  description: '',
};
function CreateProduct() {
  const [product, setProduct] = useState(INITIAL_PRODUCT);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const isProduct = Object.values(product).every((el) => Boolean(el));
    isProduct ? setDisabled(false) : setDisabled(true);
  }, [product]);

  function handleChange(e) {
    const { name, value } = e.target;
    setProduct((prevState) => ({ ...prevState, [name]: value }));
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setLoading(true);
      setError('');
      const token = cookie.get('token');
      const { name, price, description } = product;
      const formData = new FormData();
      for (const { file } of product.media) {
        formData.append('files', file);
      }
      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);
      const headers = {
        headers: {
          Authorization: token,
          'content-type': 'multipart/form-data',
        },
      };
      const url = `${baseUrl}/api/product`;
      await axios.post(url, formData, headers);
      setLoading(false);
      setProduct(INITIAL_PRODUCT);
      setSuccess(true);
    } catch (error) {
      catchErrors(error, setError);
      console.error('ERROR!', error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Header as="h2" block>
        <Icon name="add" color="orange" />
        Create New Product
      </Header>
      <Form
        loading={loading}
        success={success}
        error={Boolean(error)}
        onSubmit={handleSubmit}
      >
        <Message
          success
          icon="check"
          header="Success!"
          content="Your product has been posted"
        />
        <Message error header="Oops!" content={error} />
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            name="name"
            label="Name"
            placeholder="Name"
            onChange={handleChange}
            value={product.name}
          />
          <Form.Field
            control={Input}
            name="price"
            label="Price"
            placeholder="Price"
            min="0.00"
            step="0.01"
            type="number"
            onChange={handleChange}
            value={product.price}
          />
        </Form.Group>

        <Form.Field>
          <label>Media</label>
          <ImagesForm
            state={product}
            setState={setProduct}
            maxNumber={4}
            id="images-form"
          />
        </Form.Field>

        <Form.Group widths="equal">
          <Form.Field
            control={TextArea}
            name="description"
            label="Description"
            placeholder="Description"
            onChange={handleChange}
            value={product.description}
          />
        </Form.Group>
        <Form.Field
          control={Button}
          disabled={disabled || loading}
          color="blue"
          icon="pencil alternate"
          content="Submit"
          type="submit"
        />
      </Form>
    </>
  );
}

export default CreateProduct;
