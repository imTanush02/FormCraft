
const express = require('express');
const Form = require('../models/Form');
const Response = require('../models/Response');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.post('/:formId', async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);

    if (!form || !form.isPublished) {
      return res.status(404).json({ message: 'Form not found or not accepting responses' });
    }
    if (!form.settings.allowMultipleSubmissions) {
      const existingByIp = await Response.findOne({
        parentFormId: form._id,
        'sysDetails.ipAddress': req.ip || 'unknown',
      });
      if (existingByIp) {
        return res.status(429).json({ message: 'You have already submitted a response to this form' });
      }
    }

    const { answers } = req.body;
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ message: 'Answers object is required' });
    }

    // Server-side required-field validation
    const missingFields = [];
    form.fields.forEach((field) => {
      if (field.isRequired) {
        const answer = answers[field.fieldId];
        if (answer === undefined || answer === null || answer === '' ||
            (Array.isArray(answer) && answer.length === 0)) {
          missingFields.push(field.label);
        }
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Required fields missing: ${missingFields.join(', ')}`,
      });
    }
    const submission = await Response.create({
      parentFormId: form._id,
      answers,
      sysDetails: {
        ipAddress: req.ip || req.connection?.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        referrer: req.headers.referer || '',
      },
    });
    form.replyCount = (form.replyCount || 0) + 1;
    await form.save();

    res.status(201).json({ message: 'Response submitted successfully', id: submission._id });
  } catch (err) {
    console.log('Error caught in Submit response error::', err.message);
    res.status(500).json({ message: 'Failed to submit response' });
  }
});

router.get('/:formId', requireAuth, async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.formId, creatorId: req.userId });
    if (!form) {
      return res.status(404).json({ message: 'Form not found or access denied' });
    }

    const { page = 1, limit = 50, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const responses = await Response.find({ parentFormId: form._id })
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Response.countDocuments({ parentFormId: form._id });

    res.json({
      responses,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        pages: Math.ceil(totalCount / parseInt(limit)),
      },
      form: {
        title: form.title,
        fields: form.fields,
      },
    });
  } catch (err) {
    console.log('Error caught in List responses error::', err.message);
    res.status(500).json({ message: 'Failed to fetch responses' });
  }
});

router.get('/:formId/analytics', requireAuth, async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.formId, creatorId: req.userId });
    if (!form) {
      return res.status(404).json({ message: 'Form not found or access denied' });
    }

    const allResponses = await Response.find({ parentFormId: form._id });

    // 1) Submissions over time — group by date
    const submissionsByDate = {};
    allResponses.forEach((resp) => {
      const dateKey = new Date(resp.submittedAt).toISOString().split('T')[0];
      submissionsByDate[dateKey] = (submissionsByDate[dateKey] || 0) + 1;
    });
    const timelineData = Object.entries(submissionsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 2) Field-specific stats for choice-based fields (dropdown, checkbox, radio)
    const fieldStats = {};
    const choiceFields = form.fields.filter((f) =>
      ['dropdown', 'checkbox', 'radio'].includes(f.kind)
    );

    choiceFields.forEach((field) => {
      const distribution = {};
      allResponses.forEach((resp) => {
        const val = resp.answers[field.fieldId];
        if (val !== undefined && val !== null) {
          const values = Array.isArray(val) ? val : [val];
          values.forEach((v) => {
            distribution[v] = (distribution[v] || 0) + 1;
          });
        }
      });
      fieldStats[field.fieldId] = {
        label: field.label,
        kind: field.kind,
        distribution,
      };
    });

    res.json({
      totalSubmissions: allResponses.length,
      timelineData,
      fieldStats,
    });
  } catch (err) {
    console.log('Error caught in Analytics error::', err.message);
    res.status(500).json({ message: 'Failed to generate analytics' });
  }
});

router.get('/:formId/export', requireAuth, async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.formId, creatorId: req.userId });
    if (!form) {
      return res.status(404).json({ message: 'Form not found or access denied' });
    }

    const allResponses = await Response.find({ parentFormId: form._id }).sort({ submittedAt: -1 });
    const exportData = allResponses.map((resp) => {
      const row = { submissionId: resp._id, submittedAt: resp.submittedAt };

      form.fields.forEach((field) => {
        const val = resp.answers[field.fieldId];
        // Flatten arrays (checkboxes) to comma-separated strings
        row[field.label] = Array.isArray(val) ? val.join(', ') : (val ?? '');
      });

      row.ipAddress = resp.sysDetails?.ipAddress || '';
      row.userAgent = resp.sysDetails?.userAgent || '';

      return row;
    });

    res.json({ exportData, formTitle: form.title });
  } catch (err) {
    console.log('Error caught in Export error::', err.message);
    res.status(500).json({ message: 'Failed to export responses' });
  }
});

module.exports = router;
