import { buildEntitySchema } from '@vyapti/core';
import { District } from './district.entity';
import { Division } from './division.entity';
import { Organisation } from './organisation.entity';
import { State } from './state.entity';
import { Taluka } from './taluka.entity';

export const entitySchemas = [
    buildEntitySchema(District),
    buildEntitySchema(Division),
    buildEntitySchema(Organisation),
    buildEntitySchema(State),
    buildEntitySchema(Taluka),
];
