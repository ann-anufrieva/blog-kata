import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

import './spinner.css';

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 55,
    }}
    spin
    
  />
);
const Spinner = () => <Spin className='spin' indicator={antIcon} />;
export default Spinner;