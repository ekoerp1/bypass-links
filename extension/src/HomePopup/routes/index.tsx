import { ROUTES } from 'GlobalConstants/routes';
import { Route } from 'react-router-dom';
import PopupHome from 'SrcPath/HomePopup/containers/PopupHome';

export const HomePageRoute = (
  <Route path={ROUTES.HOMEPAGE} element={<PopupHome />} />
);
