import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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

export default function Repository() {
  const [repository, setRepository] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState('all');
  const [page, setPage] = useState(1);
  const { repo } = useParams();

  const repoName = decodeURIComponent(repo);

  useEffect(() => {
    /*
     * Se é necessário aguardar uma requisição após a outra
     * const response = await api.get(`repos/${repoName}`);
     * const issues = await api.get(`repos/${repoName}/issues`);
     */
    // Fazendo as chamadas juntas, sem uma aguardar a outra terminar
    async function updateRepos() {
      const [reposUpdated, issuesUpdated] = await Promise.all([
        api.get(`repos/${repoName}`),
        api.get(`repos/${repoName}/issues`, {
          params: {
            per_page: 5,
          },
        }),
      ]);

      setRepository(reposUpdated.data);
      setIssues(issuesUpdated.data);
      setLoading(false);
    }
    updateRepos();
  }, [repoName]);

  async function handleStateChange(e) {
    try {
      const stateSelected = e.target.value;
      e.preventDefault();
      const newIssues = await api.get(`repos/${repoName}/issues`, {
        params: {
          state: stateSelected,
          per_page: 5,
          page: 1,
        },
      });
      setIssues(newIssues.data);
      setState(stateSelected);
      setPage(1);
    } catch (err) {
      throw Error(err.message);
    }
  }

  async function handlePageChange(direction, e) {
    e.preventDefault();
    let nextPage;

    if (direction === 'forward') {
      nextPage = page + 1;
    } else {
      nextPage = page - 1;
    }

    const newIssues = await api.get(`repos/${repoName}/issues`, {
      params: {
        state,
        per_page: 5,
        page: nextPage,
      },
    });
    setIssues(newIssues.data);
    setPage(nextPage);
    setState(state);
  }

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
            <select id="issue-state" onChange={(e) => handleStateChange(e)}>
              <option value="all">Todos</option>
              <option value="open">Abertos</option>
              <option value="closed">Fechados</option>
            </select>
          </label>
        </IssueState>

        <Pagination>
          <button
            type="button"
            onClick={(e) => handlePageChange('backward', e)}
            disabled={!(page > 1)}
          >
            <FaChevronLeft />
          </button>
          <button type="button" onClick={(e) => handlePageChange('forward', e)}>
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

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repo: PropTypes.string,
    }),
  }).isRequired,
};
