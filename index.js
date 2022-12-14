import { gql, ApolloServer,  UserInputError } from "apollo-server" 
import { v4 as uuidv4 } from 'uuid';

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
    enum YesNo {
        YES
        NO
    }

    enum NoteStatus {
        BLOCKED
        PROGRESS
        RESOLVED
    }

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
        allPersons( phone: YesNo ): [Person]!
        findPerson(name: String!): Person
    }
    
    type Mutation {
        addPerson(
            name: String!
            phone: String
            street: String!
            city: String!
        ): Person
        editNumber(
            name: String!
            phone: String
        ):Person
    }
`  // cuando anadamos la persona lo que va a hacer es restornar la persona
// estamos tal cual resoviendo los tipos  de datos que definimos
const resolvers = {
    Query: {
        personCount: () => persons.length,
        allPersons: ( root, args ) => {
            if (!args.phone) return persons //los enum srive principalmete paara poder definir valores y definir por medio de estado ya redifinidos 
            return persons.filter( person => {
                return args.phone ==="YES" ? person.phone : !person.phone 
            })
        },
        findPerson:( root, args ) => { // colocar la logica para poder definir resoler los tipos de datos qu e defini, root corresponde al objeto que hizo match
            const { name } = args // simpre los argumentos hay que desectructurarlos
            return persons.find((person) => person.name === name)
        }
    }, 
    Mutation:{
        addPerson: ( root, args ) => {

            if (persons.find((person) => person.name === args.name)){
                // throw new Error(`person ${args.name} already exists`) // es una forma de hacer un error
                throw new UserInputError(`Name must be unique`, {
                    invalidArgs: args.name
                }); 

            }
            // const { name, phone, street, city } = args 
            const person = { ...args, id: uuidv4()}
            persons.push(person)
            return person
        },
        editNumber : ( root, args ) => { // editando type person y de la data 
            const personIndex = persons.findIndex((person) => person.name === args.name)
            if (!personIndex === -1) return null

            const person = persons[personIndex]

            const updatedPerson = { ...person, phone: args.phone }
            persons[personIndex] = updatedPerson

            return updatedPerson

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