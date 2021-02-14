# 프로필 페이지 만들기

기존에 만들어두었던 profile.js에 프로필 페이지를 구현해본다.
리액트에서 작업을 할 때 우선 렌더링할 기능 단위를 작은 컴포넌트로 나누어 설계를 하는 것이 좋다.

예를 들어 프로필 페이지에 NicknameEditForm와 FollowList 컴포넌트로 각 기능을 구현하겠다를 먼저 배치하고 이후에 상세 컴포넌트를 구현하는 방식이다.

```jsx
// profile.js
import AppLayout from "../components/AppLayout";
import Head from "next/head";

import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";

const Profile = () => {
  // dummy data
  const followerList = [{ nickname: "비키" }, { nickname: "워니" }, { nickname: "썬" }];
  const followingList = [{ nickname: "비키" }, { nickname: "워니" }, { nickname: "썬" }];

  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={followingList} />
        <FollowList header="팔로워 목록" data={followerList} />
      </AppLayout>
    </>
  );
};

export default Profile;
```

위에서 만든 NicknameEditForm와 FollowList 컴포넌트를 구현해본다.

```jsx
// NicknameEditForm.js
import React, { useMemo } from "react";
import { Form, Input } from "antd";

const NicknameEditForm = () => {
  const style = useMemo(() => ({ marginBottom: 20, border: "1px solid #d9d9d9", padding: 20 }), []);

  return (
    <Form style={style}>
      <Input.Search addonBefore="닉네임" enterButton="수정" />
    </Form>
  );
};

export default NicknameEditForm;
```

```jsx
// FollowList.js
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { List, Button, Card } from "antd";
import { StopOutlined } from "@ant-design/icons";

const FollowList = ({ header, data }) => {
  const listStyle = useMemo(() => ({ marginBottom: 20 }), []);
  const loadMoreStyle = useMemo(() => ({ textAlign: "center", margin: "10px 0" }), []);
  const renderListStyle = useMemo(() => ({ marginTop: 20 }), []);

  return (
    <List
      header={<div>{header}</div>}
      style={listStyle}
      grid={{ gutter: 4, xs: 2, md: 3 }}
      size="small"
      loadMore={
        <div style={loadMoreStyle}>
          <Button>더보기</Button>
        </div>
      }
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={renderListStyle}>
          <Card actions={[<StopOutlined key="stop" />]}>
            <Card.Meta description={item.nickname} />
          </Card>
        </List.Item>
      )}
    />
  );
};

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

export default FollowList;
```
