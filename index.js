import { gql, ApolloServer } from "apollo-server" 

// los datos
const persons = [
    {
        name: 'John',
        phone: '123-456-1234',
        street: 'John Street',
        city: 'San Francisco',
        id: 'SDSDFSDFG-ASDF44RASFSDF'
    },
    {
        name: 'Andres',
        street: 'John Street',
        city: 'Bogota',
        id: 'SDSDFSDF2G-ASDF44RASFSDF'
    },
    {
        name: 'miguel',
        phone: '123-',
        street: 'John Street',
        city: 'San also',
        id: 'SDSDFSDF3-ASDF44RASFSDF'
    }
]
// aqui describimos los tipos de datos
const typeDefinitions = gql`

    type Address {
        street: String!
        city: String!
    }

    type Person {
        name: String!
        phone: String
        address: Address!
        id: ID!
    }

    type Query {
        personCount: Int!
        allPersons: [Person]!
        findPerson(name: String!): Person
    }
`
// estamos tal cual resoviendo los tipos  de datos que definimos
const resolvers = {
    Query: {
        personCount: () => persons.length,
        allPersons: () => persons,
        findPerson:( root, args ) => { // colocar la logica para poder definir resoler los tipos de datos qu e defini, root corresponde al objeto que hizo match
            const { name } = args // simpre los argumentos hay que desectructurarlos
            return persons.find((person) => person.name === name)
        }
    }, 

    Person: {
        // canDrink: (root) => root.age > 18 ,
        // allStreet: (root) => `${root.street} - ${root.city}`, un ejmlpo de como puedo hacer calculos indexando en un type antes previamente extrayendolo
        address: (root) => { //  asi como capto la data asi mismo returno en otro tipo la data
            return {
                street: root.street,
                city: root.city    
            } 
        } 
    }
}

const server = new ApolloServer({
    typeDefs: typeDefinitions,
    resolvers
     
})

server.listen().then(({url}) =>   {
    console.log(`listening ready ${url}`);
})