import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

import userRoutes from './routes/userRoutes.js';
app.use('/api/users', userRoutes);

import areasRoutes from './routes/areasRoutes.js';
app.use('/api/areas', areasRoutes);

import auditlogsRoutes from './routes/auditlogsRoutes.js';
app.use('/api/audit_logs', auditlogsRoutes);

import bankaccountsRoutes from './routes/bankaccountsRoutes.js';
app.use('/api/bank_accounts', bankaccountsRoutes);

import banksRoutes from './routes/banksRoutes.js';
app.use('/api/banks', banksRoutes);

import citiesRoutes from './routes/citiesRoutes.js';
app.use('/api/cities', citiesRoutes);

import coloniesRoutes from './routes/coloniesRoutes.js';
app.use('/api/colonies', coloniesRoutes);

import companiesRoutes from './routes/companiesRoutes.js';
app.use('/api/companies', companiesRoutes);

import countriesRoutes from './routes/countriesRoutes.js';
app.use('/api/countries', countriesRoutes);

import customersRoutes from './routes/customersRoutes.js';
app.use('/api/customers', customersRoutes);

import departmentsRoutes from './routes/departmentsRoutes.js';
app.use('/api/departments', departmentsRoutes);

import designationsRoutes from './routes/designationsRoutes.js';
app.use('/api/designations', designationsRoutes);

import districtsRoutes from './routes/districtsRoutes.js';
app.use('/api/districts', districtsRoutes);

import documentcategoriesRoutes from './routes/documentcategoriesRoutes.js';
app.use('/api/document_categories', documentcategoriesRoutes);

import documentheadsRoutes from './routes/documentheadsRoutes.js';
app.use('/api/document_heads', documentheadsRoutes);

import employeesRoutes from './routes/employeesRoutes.js';
app.use('/api/employees', employeesRoutes);

import itemmakersRoutes from './routes/itemmakersRoutes.js';
app.use('/api/item_makers', itemmakersRoutes);

import languagesRoutes from './routes/languagesRoutes.js';
app.use('/api/languages', languagesRoutes);

import notetypesRoutes from './routes/notetypesRoutes.js';
app.use('/api/note_types', notetypesRoutes);

import particulargroupsRoutes from './routes/particulargroupsRoutes.js';
app.use('/api/particular_groups', particulargroupsRoutes);

import particulartypesRoutes from './routes/particulartypesRoutes.js';
app.use('/api/particular_types', particulartypesRoutes);

import particularsRoutes from './routes/particularsRoutes.js';
app.use('/api/particulars', particularsRoutes);

import qualityclassificationsRoutes from './routes/qualityclassificationsRoutes.js';
app.use('/api/quality_classifications', qualityclassificationsRoutes);

import rolesRoutes from './routes/rolesRoutes.js';
app.use('/api/roles', rolesRoutes);

import servicecategoriesRoutes from './routes/servicecategoriesRoutes.js';
app.use('/api/service_categories', servicecategoriesRoutes);

import servicetypesRoutes from './routes/servicetypesRoutes.js';
app.use('/api/service_types', servicetypesRoutes);

import signaltypesRoutes from './routes/signaltypesRoutes.js';
app.use('/api/signal_types', signaltypesRoutes);

import statesRoutes from './routes/statesRoutes.js';
app.use('/api/states', statesRoutes);

import statusdefinitionsRoutes from './routes/statusdefinitionsRoutes.js';
app.use('/api/status_definitions', statusdefinitionsRoutes);

import stbschemesRoutes from './routes/stbschemesRoutes.js';
app.use('/api/stb_schemes', stbschemesRoutes);

import stbtypesRoutes from './routes/stbtypesRoutes.js';
app.use('/api/stb_types', stbtypesRoutes);

import storesRoutes from './routes/storesRoutes.js';
app.use('/api/stores', storesRoutes);

import subdepartmentsRoutes from './routes/subdepartmentsRoutes.js';
app.use('/api/sub_departments', subdepartmentsRoutes);

import systemrightsRoutes from './routes/systemrightsRoutes.js';
app.use('/api/system_rights', systemrightsRoutes);

import taxesRoutes from './routes/taxesRoutes.js';
app.use('/api/taxes', taxesRoutes);

import termcategoriesRoutes from './routes/termcategoriesRoutes.js';
app.use('/api/term_categories', termcategoriesRoutes);

import ticketheadsRoutes from './routes/ticketheadsRoutes.js';
app.use('/api/ticket_heads', ticketheadsRoutes);

import ticketreasonsRoutes from './routes/ticketreasonsRoutes.js';
app.use('/api/ticket_reasons', ticketreasonsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
