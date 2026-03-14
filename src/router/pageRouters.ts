import * as React from 'react';
import { RouteConfig } from "src/types/router";
import TestView from "src/views/TestView";

const ROUTES: RouteConfig[] = [
  // {
  //   path: "/",
  //   name: "Home",
  //   element: React.createElement(HomePage)
  // },
  {
    path: "/test",
    name: "Test",
    element: React.createElement(TestView)
  },
];

export default ROUTES;