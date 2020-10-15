import { useState, useEffect } from 'react';
import { Segment, Divider } from 'semantic-ui-react';
import calculateCartTotal from '../../utils/calculateCartTotal';
import Skeleton from 'react-loading-skeleton';

function SavedItemsSummary({ products, loading }) {
  const [cartAmount, setCartAmount] = useState(0);

  useEffect(() => {
    const { cartTotal } = calculateCartTotal(products);
    setCartAmount(cartTotal);
  }, [products]);

  return (
    <>
      <Divider />
      <Segment clearing size="large">
        {loading ? (
          <Skeleton />
        ) : (
          <>
            <strong>Sub total:</strong>${cartAmount}
          </>
        )}
      </Segment>
    </>
  );
}

export default SavedItemsSummary;
