import React, { useState, useEffect } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default function Main() {
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [founded, setFounded] = useState(true);

  useEffect(() => {
    const repos = localStorage.getItem('repositories');

    if (repos) {
      setRepositories({ repositories: JSON.parse(repos) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('respositories', JSON.stringify(repositories));
  }, [repositories]);

  function handleAddRepo(data) {
    setRepositories([...repositories, data]);
    setNewRepo('');
    setLoading(false);
    setFounded(true);
  }

  function handleInputChange(e) {
    setFounded(true);
    setNewRepo(e.target.value);
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      setLoading(true);

      if (newRepo === '') throw new Error('Informe um repositório');

      if (repositories.find((repository) => repository.name === newRepo))
        throw new Error('Repositório duplicado');

      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      handleAddRepo(data);
    } catch (err) {
      setNewRepo('');
      setLoading(false);
      setFounded(false);
      if (err.message.includes('404'))
        err.message = 'Repositório não encontrado!';
      const error = (msg) =>
        toast.error(msg, {
          transition: Zoom,
        });
      error(err.message);
    }
  }

  return (
    <>
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={handleSubmit} founded={founded}>
          <input
            type="text"
            placeholder="Adicionar repositório (Ex: dono/repositório)"
            value={newRepo}
            onChange={handleInputChange}
          />

          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>
        <List>
          {repositories.map((repository) => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    </>
  );
}
