/* eslint-disable react/display-name */
/* eslint-disable import/no-anonymous-default-export */
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

// I love React, I can make the code so much unnecessarily complex!

export default () => {
  return (
    <Main meta={<Meta title="Lorem ipsum" description="Lorem ipsum" />}>
      <h1>This is very good code that is stable</h1>
      <p>I promise!</p>
    </Main>
  );
};
