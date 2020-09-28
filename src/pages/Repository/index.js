import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';

import {
  Loading,
  Owner,
  IssueList,
  IssueState,
  Pagination,
  Controls,
} from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    state: 'all',
    page: 1,
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    /*
     * Se é necessário aguardar uma requisição após a outra
     * const response = await api.get(`repos/${repoName}`);
     * const issues = await api.get(`repos/${repoName}/issues`);
     */

    // Fazendo as chamadas juntas, sem uma aguardar a outra terminar
    const [repository, issues] = await Promise.all([
      api.get(`repos/${repoName}`),
      api.get(`repos/${repoName}/issues`, {
        params: {
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  handleStateChange = async (e) => {
    try {
      const stateSelected = e.target.value;
      e.preventDefault();
      const { match } = this.props;
      const repoName = decodeURIComponent(match.params.repository);
      const issues = await api.get(`repos/${repoName}/issues`, {
        params: {
          state: stateSelected,
          per_page: 5,
          page: 1,
        },
      });
      this.setState({
        issues: issues.data,
        state: stateSelected,
        page: 1,
      });
    } catch (err) {
      throw Error(err.message);
    }
  };

  handlePageChange = async (direction, e) => {
    e.preventDefault();
    const { match } = this.props;
    const { page, state } = this.state;
    let nextPage;

    if (direction === 'forward') {
      nextPage = page + 1;
    } else {
      nextPage = page - 1;
    }
    const repoName = decodeURIComponent(match.params.repository);
    const issues = await api.get(`repos/${repoName}/issues`, {
      params: {
        state,
        per_page: 5,
        page: nextPage,
      },
    });
    this.setState({
      issues: issues.data,
      page: nextPage,
      state,
    });
  };

  render() {
    const { repository, issues, loading, page } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <Controls>
          <IssueState>
            <label htmlFor="issue-state">
              Filtro:
              <select id="issue-state" onChange={this.handleStateChange}>
                <option value="all">Todos</option>
                <option value="open">Abertos</option>
                <option value="closed">Fechados</option>
              </select>
            </label>
          </IssueState>

          <Pagination>
            <button
              type="button"
              onClick={(e) => this.handlePageChange('backward', e)}
              disabled={!(page > 1)}
            >
              <FaChevronLeft />
            </button>
            <button
              type="button"
              onClick={(e) => this.handlePageChange('forward', e)}
            >
              <FaChevronRight />
            </button>
          </Pagination>
        </Controls>

        <IssueList>
          {issues.map((issue) => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a
                    href={issue.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {issue.title}
                  </a>
                  {issue.labels.map((label) => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
      </Container>
    );
  }
}
