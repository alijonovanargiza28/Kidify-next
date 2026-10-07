import React from 'react';
import { Seller } from '../sellers/detail';
import withLayout from '../../libs/components/layout/LayoutBasic';
export { getStaticProps } from '../sellers/detail';
export default withLayout(() => <Seller member />);
