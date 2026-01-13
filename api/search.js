const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

/**
 * KMP (Knuth-Morris-Pratt) Algorithm Implementation
 */

function computeLPS(pattern) {
    const m = pattern.length;
    const lps = new Array(m).fill(0);
    let len = 0;
    let i = 1;

    while (i < m) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}

function kmpSearch(text, pattern) {
    if (!text || !pattern) return false;
    
    text = text.toLowerCase();
    pattern = pattern.toLowerCase();

    const n = text.length;
    const m = pattern.length;

    if (m === 0) return true;
    if (n < m) return false;

    const lps = computeLPS(pattern);
    let i = 0;
    let j = 0;

    while (i < n) {
        if (pattern[j] === text[i]) {
            i++;
            j++;
        }

        if (j === m) {
            return true;
        } else if (i < n && pattern[j] !== text[i]) {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    return false;
}

// Handler function for Vercel Serverless
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
  
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    try {
        const { q } = req.query;
        let results = [];
        
        // Fetch all data (handling limited dataset size)
        // For larger datasets, we would implement KMP in database/SQL or fetch chunks
        // Since it's 50 rows, fetching all is fine for array filtering with KMP
        const { rows } = await pool.query('SELECT * FROM kamus');

        if (q) {
            results = rows.filter(row => {
                return kmpSearch(row.bugis, q) || kmpSearch(row.indonesia, q);
            });
        } else {
            // Get random word of the day logic or just all/random
            // Returning random 5 for "Word of the Day" / Initial view simulation
             results = rows.sort(() => 0.5 - Math.random()).slice(0, 10);
        }

        res.status(200).json({
            results: results,
            total: results.length,
            query: q || null
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
