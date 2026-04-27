import Item from "../models/Item.js";

export const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch item" });
  }
};

export const createItem = async (req, res) => {
  try {

    const { price, discountPercentage } = req.body;

    const discount = (price * discountPercentage) / 100;
    const finalPrice = price - discount;

    const newItem = await Item.create({
      ...req.body,
      finalPrice,
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create item",
      error: error.message,
    });
  }
};

export const updateItem = async (req, res) => {
  try {

    const { price, discountPercentage } = req.body;

    let updateData = { ...req.body };

    if(price !== undefined && discountPercentage !== undefined){
      if(discountPercentage < 0 || discountPercentage > 100){
        return res.status(400).json({
          message: "Discount must be between 0 and 100",
        })
      }

      const discount = (price * discountPercentage) / 100;
      updateData.finalPrice = price - discount;
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update item",
      error: error.message,
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item" });
  }
};