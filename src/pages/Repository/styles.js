import styled from 'styled-components';

export const Loading = styled.div`
  color: #fff;
  font-size: 30px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const Owner = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;

  a {
    color: #2452ad;
    font-size: 16px;
    text-decoration: none;
  }

  img {
    width: 120px;
    border-radius: 50%;
    margin-top: 20px;
  }

  h1 {
    font-size: 24px;
    margin-top: 10px;
  }

  p {
    margin-top: 5px;
    font-size: 14px;
    color: #666;
    line-height: 1.4;
    text-align: center;
    max-width: 400px;
  }
`;

export const IssueList = styled.ul`
  padding-top: 30px;
  margin-top: 10px;
  border-top: 1px solid #eee;
  list-style: none;

  li {
    display: flex;
    padding: 15px 10px;
    border: 1px solid #eee;
    border-radius: 4px;

    & + li {
      margin-top: 10px;
    }
  }

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid #eee;
  }

  div {
    flex: 1;
    margin-left: 15px;

    strong {
      font-size: 16px;

      a {
        text-decoration: none;
        color: #333;

        &:hover {
          color: #2452ad;
        }
      }
      span {
        background: #eee;
        color: #333;
        border-radius: 2px;
        font-size: 12px;
        font-weight: 600;
        height: 20px;
        padding: 3px 4px;
        margin-left: 10px;
      }
    }
    p {
      margin-top: 5px;
      font-size: 12px;
      color: #999;
    }
  }
`;

export const IssueState = styled.div`
  color: #2452ad;
  font-size: 16px;
  font-weight: bold;

  select {
    background: #2452ad;
    color: #eee;

    margin-left: 10px;
    padding: 10px 10px;
    border-radius: 4px;
    border: 1px solid #eee;

    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
`;

export const Pagination = styled.div`
  color: #2452ad;
  font-size: 16px;

  button {
    background: #2452ad;
    color: #eee;
    border: 0;
    margin-left: 10px;
    border-radius: 4px;

    height: 40px;
    width: 50px;

    &[disabled] {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
`;

export const Controls = styled.div`
  padding-top: 10px;
  margin-top: 10px;
  border-top: 1px solid #eee;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
