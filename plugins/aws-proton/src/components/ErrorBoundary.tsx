/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component } from 'react';
import Alert from '@material-ui/lab/Alert';

interface Props {}
interface MyProps {}

interface MyState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<MyProps, MyState> {
  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Alert severity="error">
          Something went wrong.
        </Alert>
      );
    }

    return this.props.children; 
  }
}