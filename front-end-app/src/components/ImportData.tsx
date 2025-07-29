import './ImportData.css'
interface ImportDataProps {
    show?: boolean
    onCancel?: () => void
}

function ImportData({ show = false, onCancel }: ImportDataProps) {
    const handleDownload = (type: 'csv' | 'xlsx' | 'json') => {
        window.location.href = `http://localhost:3000/export/${type}`
    }

    if (!show) return null

    return (
        <div className='import-data-container'>
            <h1>Download Data</h1>
            <div className='import-data-body'>
                <p>Download as:</p>
                <button className='import-data-csv-button' onClick={() => handleDownload('csv')}>CSV</button>
                <button className='import-data-xlsx-button' onClick={() => handleDownload('xlsx')}>Excel</button>
                <button className='import-data-json-button' onClick={() => handleDownload('json')}>JSON</button>
                <button className='import-data-cancel-button' onClick={onCancel}>Cancel</button>
            </div>
        </div>
    )
}

export default ImportData
