import 'react-data-grid/lib/styles.css';

import DataGrid from 'react-data-grid';
const TestDataGrid = () =>{
    const columns = [
    { key: 'id', name: 'ID' },
    { key: 'title', name: 'Title' }
    ];

    const rows = [
    { id: 0, title: 'Example' },
    { id: 1, title: 'Demo' }
    ];

    return (
        <div>
            <DataGrid columns={columns} rows={rows} />
        </div>
    );
};

export default TestDataGrid;