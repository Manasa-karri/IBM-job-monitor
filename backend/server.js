// import express from 'express';
// import axios from 'axios';
// import cors from 'cors';
// import dotenv from 'dotenv';
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // app.use(cors());

// async function getBearerToken() {
//   const resp = await axios.post(
//     'https://iam.cloud.ibm.com/identity/token',
//     `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${process.env.IBM_API_KEY}`,
//     { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
//   );
//   return resp.data.access_token;
// }

// app.use(cors({
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));


// app.get('/api/jobs', async (req, res) => {
//   try {
//     const bearer = await getBearerToken();
//     const resp = await axios.get(
//       'https://quantum.cloud.ibm.com/api/v1/jobs',
//       {
//         headers: {
//           Authorization: `Bearer ${bearer}`,
//           'Service-CRN': process.env.INSTANCE_CRN,
//           'IBM-API-Version': process.env.API_VERSION || '2025-05-01'
//         }
//       }
//     );
//     res.json(resp.data);
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     res.status(500).json({ error: err.response?.data || err.message });
//   }
// });

// app.get('/api/jobs/:id', async (req, res) => {
//   try {
//     const bearer = await getBearerToken();
//     const resp = await axios.get(
//       `https://quantum.cloud.ibm.com/api/v1/jobs/${req.params.id}`,
//       {
//         headers: {
//           Authorization: `Bearer ${bearer}`,
//           'Service-CRN': process.env.INSTANCE_CRN,
//           'IBM-API-Version': process.env.API_VERSION || '2025-05-01'
//         }
//       }
//     );
//     res.json(resp.data);
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     res.status(500).json({ error: err.response?.data || err.message });
//   }
// });


// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors());

async function getBearerToken() {
  const resp = await axios.post(
    'https://iam.cloud.ibm.com/identity/token',
    `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${process.env.IBM_API_KEY}`,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return resp.data.access_token;
}

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.get('/api/jobs', async (req, res) => {
  try {
    const bearer = await getBearerToken();
    const resp = await axios.get(
      'https://quantum.cloud.ibm.com/api/v1/jobs',
      {
        headers: {
          Authorization: `Bearer ${bearer}`,
          'Service-CRN': process.env.INSTANCE_CRN,
          'IBM-API-Version': process.env.API_VERSION || '2025-05-01'
        }
      }
    );
    res.json(resp.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.get('/api/jobs/:id', async (req, res) => {
  try {
    const bearer = await getBearerToken();
    const resp = await axios.get(
      `https://quantum.cloud.ibm.com/api/v1/jobs/${req.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${bearer}`,
          'Service-CRN': process.env.INSTANCE_CRN,
          'IBM-API-Version': process.env.API_VERSION || '2025-05-01'
        }
      }
    );
    res.json(resp.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));