import './ImportData.css'
interface ImportDataProps {
    show?: boolean
    onCancel?: () => void
}

function ImportData({ show = false, onCancel }: ImportDataProps) {
    const handleDownload = async (type: 'csv' | 'xlsx' | 'json') => {
        const token = localStorage.getItem('authToken')
        try {
            const res = await fetch(`http://localhost:3000/export/${type}`, {
                method: 'GET',
                headers: {
                    'Authorization': token || ''
                }
            })
            if (!res.ok) throw new Error('Download failed')
            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `customers.${type}`
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
        } catch (err) {
            alert('Download failed. Please check your login.')
        }
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
