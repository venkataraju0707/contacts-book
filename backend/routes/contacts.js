const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');


 
router.post('/', async (req, res) => {
try {
const { name, email, phone } = req.body;
 
if (!name || !email || !phone) return res.status(400).json({ message: 'Missing fields' });
if (!/\S+@\S+\.\S+/.test(email)) return res.status(400).json({ message: 'Invalid email' });
if (!/^\d{10}$/.test(phone)) return res.status(400).json({ message: 'Phone must be 10 digits' });


const contact = new Contact({ name, email, phone });
const saved = await contact.save();
res.status(201).json(saved);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


 
router.get('/', async (req, res) => {
try {
const page = Math.max(1, parseInt(req.query.page) || 1);
const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 5));
const skip = (page - 1) * limit;


const [total, contacts] = await Promise.all([
Contact.countDocuments(),
Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit)
]);


res.json({ data: contacts, page, limit, total, totalPages: Math.ceil(total / limit) });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone must be 10 digits' });
    }

    const updated = await Contact.findByIdAndUpdate(
      id,
      { name, email, phone },
      { new: true } // return the updated document
    );

    if (!updated) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

 
router.delete('/:id', async (req, res) => {
try {
const id = req.params.id;
const deleted = await Contact.findByIdAndDelete(id);
if (!deleted) return res.status(404).json({ message: 'Not found' });
res.json({ message: 'Deleted', id });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


module.exports = router;
