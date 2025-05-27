/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getOneNote = (id) => /* GraphQL */ `
  query GetNote {
    getNote(id: "${id}") {
      id
      user
      name
      image
      icon
      star
      description
      link
      date
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listNotes = /* GraphQL */ `
  query ListNotes(
    $filter: ModelNoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        user
        name
        image
        icon
        star
        description
        link
        date
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
