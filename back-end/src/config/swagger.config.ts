import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { envConfig } from './env.config';

const loadSwaggerSpec = () => {
  try {
    const swaggerPath = path.join(__dirname, '../docs/swagger.yaml');
    const fileContents = fs.readFileSync(swaggerPath, 'utf8');
    const swaggerSpec = yaml.load(fileContents) as any;

    if (swaggerSpec.servers && swaggerSpec.servers.length > 0) {
      swaggerSpec.servers[0].url = `http://localhost:${envConfig.PORT}`;
    }

    return swaggerSpec;
  } catch (error) {
    console.error('Error loading swagger.yaml:', error);
    throw error;
  }
};

export const swaggerSpec = loadSwaggerSpec();
