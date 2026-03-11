
const express = require('express');
const { nanoid } = require('nanoid');
const Form = require('../models/Form');
const Response = require('../models/Response');
const requireAuth = require('../middleware/auth');

const router = express.Router();

const buildSlug = (title) => {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  
    .replace(/^-|-$/g, '');        
  return `${base}-${nanoid(6)}`;
};

router.get('/', requireAuth, async (req, res) => {
  try {
    const forms = await Form.find({ creatorId: req.userId })
      .sort({ updatedAt: -1 })
      .select('title description slug isPublished replyCount createdAt updatedAt');

    res.json({ forms });
  } catch (err) {
    console.log('Error caught in List forms error::', err.message);
    res.status(500).json({ message: 'Failed to fetch forms' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Form title is required' });
    }

    const slug = buildSlug(title);

    const form = await Form.create({
      title: title.trim(),
      description: (description || '').trim(),
      slug,
      creatorId: req.userId,
      fields: [],
      design: {},
      settings: {},
    });

    res.status(201).json({ form });
  } catch (err) {
    console.log('Error caught in Create form error::', err.message);
    res.status(500).json({ message: 'Failed to create form' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, creatorId: req.userId });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json({ form });
  } catch (err) {
    console.log('Error caught in Get form error::', err.message);
    res.status(500).json({ message: 'Failed to fetch form' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, creatorId: req.userId });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    const allowedUpdates = ['title', 'description', 'fields', 'design', 'settings', 'isPublished'];
    allowedUpdates.forEach((key) => {
      if (req.body[key] !== undefined) {
        form[key] = req.body[key];
      }
    });

    await form.save();
    res.json({ form });
  } catch (err) {
    console.log('Error caught in Update form error::', err.message);
    res.status(500).json({ message: 'Failed to update form' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const form = await Form.findOneAndDelete({ _id: req.params.id, creatorId: req.userId });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    await Response.deleteMany({ parentFormId: form._id });

    res.json({ message: 'Form and its responses deleted successfully' });
  } catch (err) {
    console.log('Error caught in Delete form error::', err.message);
    res.status(500).json({ message: 'Failed to delete form' });
  }
});

router.patch('/:id/publish', requireAuth, async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, creatorId: req.userId });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    form.isPublished = !form.isPublished;
    await form.save();

    res.json({ form, message: form.isPublished ? 'Form published' : 'Form unpublished' });
  } catch (err) {
    console.log('Error caught in Publish toggle error::', err.message);
    res.status(500).json({ message: 'Failed to toggle publish status' });
  }
});

router.post('/:id/duplicate', requireAuth, async (req, res) => {
  try {
    const original = await Form.findOne({ _id: req.params.id, creatorId: req.userId });
    if (!original) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const duplicateTitle = `${original.title} (Copy)`;
    const duplicate = await Form.create({
      title: duplicateTitle,
      description: original.description,
      slug: buildSlug(duplicateTitle),
      creatorId: req.userId,
      fields: original.fields,
      design: original.design,
      settings: original.settings,
      isPublished: false,          
      replyCount: 0,
    });

    res.status(201).json({ form: duplicate });
  } catch (err) {
    console.log('Error caught in Duplicate form error::', err.message);
    res.status(500).json({ message: 'Failed to duplicate form' });
  }
});

router.get('/public/:slug', async (req, res) => {
  try {
    const form = await Form.findOne({ slug: req.params.slug, isPublished: true });
    if (!form) {
      return res.status(404).json({ message: 'Form not found or not published' });
    }

    res.json({
      form: {
        id: form._id,
        title: form.title,
        description: form.description,
        fields: form.fields,
        design: form.design,
        settings: form.settings,
      },
    });
  } catch (err) {
    console.log('Error caught in Public form error::', err.message);
    res.status(500).json({ message: 'Failed to fetch public form' });
  }
});

module.exports = router;
