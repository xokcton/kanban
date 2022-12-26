const Section = require('../models/section')
const Task = require('../models/task')

exports.create = async (req, res) => {
  try {
    const { boardId } = req.params
    const section = await Section.create({ board: boardId })

    section._doc.tasks = []

    res.status(201).json(section)
  } catch (error) {
    res.status(500).json(err)
  }
}

exports.update = async (req, res) => {
  try {
    const { sectionId } = req.params
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { $set: req.body }
    )

    section._doc.tasks = []

    res.status(200).json(section)
  } catch (error) {
    res.status(500).json(err)
  }
}

exports.delete = async (req, res) => {
  try {
    const { sectionId } = req.params

    await Task.deleteMany({ section: sectionId })
    await Section.deleteOne({ _id: sectionId })

    res.status(200).json('deleted')
  } catch (error) {
    res.status(500).json(err)
  }
}