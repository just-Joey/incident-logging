import prisma from  /./prisma.js';
import logger from './logger.js';

export const createContext = ({req}) => {
    return {
        prisma,
        logger,
        //auth goes here later     
    }
}