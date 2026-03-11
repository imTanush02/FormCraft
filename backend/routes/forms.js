
const express = require('express');
const { nanoid } = require('nanoid');
const Form = require('../models/Form');
const Response = require('../models/Response');
const guardRoute = require('../middleware/auth');

const router = express.Router();

const buildSlug = (title) => {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // replace non-alphanumeric with hyphens
    .replace(/^-|-$/g, '');        // trim leading/trailing hyphens
  return `${base}-${nanoid(6)}`;
};

router.get('/', guardRoute, async (req, res) => {
  try {
    const forms = await Form.find({ architect: req.userId })
      .sort({ updatedAt: -1 })
      .select('title description slug isPublished submissionCount createdAt updatedAt');

    res.json({ forms });
  } catch (err) {
    console.error('List forms error:', err.message);
    res.status(500).json({ message: 'Failed to fetch forms' });
  }
});

router.post('/', guardRoute, async (req, res) => {
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
      architect: req.userId,
      fields: [],
      design: {},
      settings: {},
    });

    res.status(201).json({ form });
  } catch (err) {
    console.error('Create form error:', err.message);
    res.status(500).json({ message: 'Failed to create form' });
  }
});

router.get('/:id', guardRoute, async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, architect: req.userId });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json({ form });
  } catch (err) {
    console.error('Get form error:', err.message);
    res.status(500).json({ message: 'Failed to fetch form' });
  }
});

router.put('/:id', guardRoute, async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, architect: req.userId });
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
    console.error('Update form error:', err.message);
    res.status(500).json({ message: 'Failed to update form' });
  }
});

router.delete('/:id', guardRoute, async (req, res) => {
  try {
    const form = await Form.findOneAndDelete({ _id: req.params.id, architect: req.userId });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Cascade-delete all responses tied to this form
    await Response.deleteMany({ formRef: form._id });

    res.json({ message: 'Form and its responses deleted successfully' });
  } catch (err) {
    console.error('Delete form error:', err.message);
    res.status(500).json({ message: 'Failed to delete form' });
  }
});

router.patch('/:id/publish', guardRoute, async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, architect: req.userId });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    form.isPublished = !form.isPublished;
    await form.save();

    res.json({ form, message: form.isPublished ? 'Form published' : 'Form unpublished' });
  } catch (err) {
    console.error('Publish toggle error:', err.message);
    res.status(500).json({ message: 'Failed to toggle publish status' });
  }
});

router.post('/:id/duplicate', guardRoute, async (req, res) => {
  try {
    const original = await Form.findOne({ _id: req.params.id, architect: req.userId });
    if (!original) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const duplicateTitle = `${original.title} (Copy)`;
    const duplicate = await Form.create({
      title: duplicateTitle,
      description: original.description,
      slug: buildSlug(duplicateTitle),
      architect: req.userId,
      fields: original.fields,
      design: original.design,
      settings: original.settings,
      isPublished: false,          // duplicates always start as drafts
      submissionCount: 0,
    });

    res.status(201).json({ form: duplicate });
  } catch (err) {
    console.error('Duplicate form error:', err.message);
    res.status(500).json({ message: 'Failed to duplicate form' });
  }
});

router.get('/public/:slug', async (req, res) => {
  try {
    const form = await Form.findOne({ slug: req.params.slug, isPublished: true });
    if (!form) {
      return res.status(404).json({ message: 'Form not found or not published' });
    }

    // Return only the data needed for rendering — exclude internal fields
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
    console.error('Public form error:', err.message);
    res.status(500).json({ message: 'Failed to fetch public form' });
  }
});

module.exports = router;
