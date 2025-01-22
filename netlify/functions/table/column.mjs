// netlify/functions/crudTable.js
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    const filePath = path.join(__dirname, '../data/table.json');
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    switch (event.httpMethod) {
        case 'GET':
            return {
                statusCode: 200,
                body: JSON.stringify(data),
            };

        case 'POST':
            const newRow = JSON.parse(event.body);
            data.rows.push(newRow);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return {
                statusCode: 201,
                body: JSON.stringify(newRow),
            };

        case 'PUT':
            const updatedRow = JSON.parse(event.body);
            const indexToUpdate = data.rows.findIndex(row => row.id === updatedRow.id);
            if (indexToUpdate !== -1) {
                data.rows[indexToUpdate] = updatedRow;
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                return {
                    statusCode: 200,
                    body: JSON.stringify(updatedRow),
                };
            }
            return { statusCode: 404, body: 'Row not found' };

        case 'DELETE':
            const { id } = JSON.parse(event.body);
            data.rows = data.rows.filter(row => row.id !== id);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return {
                statusCode: 204,
                body: '',
            };

        default:
            return {
                statusCode: 405,
                body: 'Method Not Allowed',
            };
    }
};