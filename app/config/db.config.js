/**
 * Database Configuration
 * 
 * This module exports an object containing the configuration settings
 * for connecting to the ClearDB MySQL database on Heroku.
 * 
 * @module dbConfig
 * @type {Object}
 * @property {string} HOST - The hostname of the database server
 * @property {string} USER - The username for database authentication
 * @property {string} PASSWORD - The password for database authentication
 * @property {string} DB - The name of the database to connect to
 */
export default {
    HOST: "us-cluster-east-01.k8s.cleardb.net",
    USER: "b4c42cb403eb0a",
    PASSWORD: "d3934b54",
    DB: "heroku_28b8dc682c0181a",
};