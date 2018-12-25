import React from "react";
import { unstable_createResource as createResource } from "react-cache";
import sleep from "sleep-promise";

let Resource = createResource(id =>
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then(res =>
    res.json()
  )
);

const ImageResource = createResource(
  src =>
    new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.src = src;
    })
);

function Img({ src, alt, ...rest }) {
  return (
    <img src={ImageResource.read(src)} alt={alt} {...rest} />
  );
}

export function Detail({ pokemonId: id }) {
  let pokemon = Resource.read(id);

  return (
    <article>
      <section>
        <h1>{pokemon.name}</h1>
      </section>
      <section>
        <Img
          src={pokemon.sprites.front_default}
          alt={`${pokemon.name} image`}
        />
      </section>
      <section>
        <dl>
          <dt>Height</dt>
          <dd>{pokemon.height}</dd>
          <dt>Weight</dt>
          <dd>{pokemon.weight}</dd>
          <dt>Abilities</dt>
          <dd>
            <ul>
              {pokemon.abilities.map(({ ability }) => (
                <li>{ability.name}</li>
              ))}
            </ul>
          </dd>
        </dl>
      </section>
      <section>
        <h2>Type</h2>
        <ul>
          {pokemon.types.map(({ type }) => (
            <li>{type.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Stats</h2>
        <table>
          <tbody>
            <tr>
              {pokemon.stats.map(({ base_stat }) => (
                <td>{base_stat}</td>
              ))}
            </tr>
          </tbody>
          <tfoot>
            <tr>
              {pokemon.stats.map(({ stat }) => (
                <th>{stat.name}</th>
              ))}
            </tr>
          </tfoot>
        </table>
      </section>
    </article>
  );
}

export function ListItem({
  className,
  component: Component = "li",
  ...props
}) {
  return (
    <Component
      className={["pokemon-list-item", className].join(" ")}
      {...props}
    />
  );
}

let CollectionResource = createResource(() =>
  fetch("https://pokeapi.co/api/v2/pokemon/")
    .then(res => res.json())
    .then(res => ({
      ...res,
      results: res.results.map(pokemon => ({
        id: pokemon.url.split("/")[6],
        ...pokemon,
      })),
    }))
);

export function List({ renderItem }) {
  return CollectionResource.read().results.map(renderItem);
}

export function ListError() {
  return <span>Couldn't catch 'em all</span>;
}

export function ListFallback() {
  return <span>Looing for Pokemon...</span>;
}
