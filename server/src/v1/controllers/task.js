const Section = require('../models/section')
const Task = require('../models/task')

exports.create = async (req, res) => {
  try {
    const { sectionId } = req.body
    const section = await Section.findById(sectionId)
    const tasksCount = await Task.find({ section: sectionId }).count()
    const task = await Task.create({
      section: sectionId,
      position: tasksCount > 0 ? tasksCount : 0
    })

    task._doc.section = section

    res.status(201).json(task)
  } catch (error) {
    res.status(500).json(err)
  }
}

exports.update = async (req, res) => {
  try {
    const { taskId } = req.params
    const task = await Task.findByIdAndUpdate(
      taskId,
      { $set: req.body }
    )

    res.status(200).json(task)
  } catch (error) {
    res.status(500).json(err)
  }
}

exports.delete = async (req, res) => {
  try {
    const { taskId } = req.params
    const currentTask = await Task.findById(taskId)

    await Task.deleteOne({ _id: taskId })

    const tasks = await Task.find({ section: currentTask.section }).sort('position')

    for (const key in tasks) {
      await Task.findByIdAndUpdate(
        tasks[key].id,
        { $set: { position: key } }
      )
    }

    res.status(200).json('deleted')
  } catch (error) {
    res.status(500).json(err)
  }
}

exports.updatePosition = async (req, res) => {
  try {
    const { resourceList, destinationList, resourceSectionId, destinationSectionId } = req.body
    const resourceListReverse = resourceList.reverse()
    const destinationListReverse = destinationList.reverse()

    if (resourceSectionId !== destinationSectionId) {
      for (const key in resourceListReverse) {
        await Task.findByIdAndUpdate(
          resourceListReverse[key].id,
          {
            $set: {
              section: resourceSectionId,
              position: key
            }
          }
        )
      }
    }

    for (const key in destinationListReverse) {
      await Task.findByIdAndUpdate(
        destinationListReverse[key].id,
        {
          $set: {
            section: destinationSectionId,
            position: key
          }
        }
      )
    }

    res.status(200).json('updated')
  } catch (error) {
    res.status(500).json(err)
  }
}