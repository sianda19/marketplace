import React, { useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import cookie from 'js-cookie';
import axios from 'axios';
import baseUrl from '../../utils/baseUrl';

const CommentForm = ({ content, refId, mutate, _data }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  function handleChange(e) {
    const { value } = e.target;
    setText(value);
  }
  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setLoading(true);
      const token = cookie.get('token');
      const payload = { text, refId };
      const headers = {
        headers: {
          Authorization: token,
        },
      };
      const url = `${baseUrl}/api/comment`;
      const { data } = await axios.post(url, payload, headers);
      mutate({
        ..._data,
        comments: _data.comments.concat(data.comments.slice(-1)[0]),
      });
      setText('');
      setLoading(false);
    } catch (error) {
      console.error('ERROR!', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form reply onSubmit={handleSubmit}>
      <Segment loading={loading}>
        <Form.TextArea
          onChange={handleChange}
          style={{ height: '3em' }}
          value={text}
        />
        <Button
          content={content}
          labelPosition="left"
          icon="edit"
          primary
          // disabled={disabled || loading}
        />
      </Segment>
    </Form>
  );
};

export default CommentForm;
