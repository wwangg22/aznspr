import './summary.css'

export default function Summary({
    averagePrice,
    averageSales,
    wordCount
}){
    console.log(wordCount)

    
    return (
            <div class="container">
                <h1>Database Summary</h1>
                <div class="metrics">
                    <div class="metric">
                        <h2>Average Price</h2>
                        <p id="averagePrice">Loading...</p>
                    </div>
                    <div class="metric">
                        <h2>Average Sales</h2>
                        <p id="averageSales">Loading...</p>
                    </div>
                </div>
                <div class="wordCount">
                    <h2>Word Count Dictionary</h2>
                    <table id="wordCountTable">
                        <tr>
                            <th>Word</th>
                            <th>Count</th>
                        </tr>
                        {wordCount.map((set) => (
                            <tr>
                                    <td>{set[0]}</td>
                                    <td>{set[1]}</td>
                            </tr>
                        ))}
                    </table>
                </div>
            </div>
    )
} 