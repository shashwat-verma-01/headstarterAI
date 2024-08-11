'use client'
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      const data = doc.data();
      inventoryList.push({
        name: doc.id,
        quantity: data.quantity ? Number(data.quantity) : 0, // Ensure quantity is a number
        ...data,
      });
    });
    
    setInventory(inventoryList);
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addItem = async (item) => {
    const lowercasedItem = item.toLowerCase();
    const docRef = doc(collection(firestore, 'inventory'), lowercasedItem);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      const newQuantity = (quantity ? Number(quantity) : 0) + 1; // Ensure quantity is a number
      await setDoc(docRef, { quantity: newQuantity });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItems = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      const currentQuantity = quantity ? Number(quantity) : 0; // Ensure quantity is a number
      if (currentQuantity <= 1) {
        await deleteDoc(docRef); // Remove the item from Firestore if quantity is 0
      } else {
        await setDoc(docRef, { quantity: currentQuantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <TextField 
        variant="outlined" 
        placeholder="Search..." 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
      />
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={() => handleOpen()}>Add New Item</Button>
      <Box border="1px solid #333">
        <Box width='800px' height='100px' bgcolor='#ADD8E6'>
          <Typography variant="h2" color="#333" 
            display="flex"
            alignItems="center" justifyContent="center"
          > Inventory Items</Typography>
        </Box>
      
        <Stack width='800px' height='300px' spacing={2} overflow="auto">
          {
            filteredInventory.map(({name, quantity}) => (
              <Box key={name} width="100%" 
                minHeight='150px'
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                bgcolor='#f0f0f0'
                padding={5}>
                <Typography variant="h3" color="#333"
                  textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h3" color="#333"
                  textAlign="center">
                  {quantity || 0} {/* Ensure quantity is displayed as a number */}
                </Typography>
                <Stack direction='row' spacing={2}>
                  <Button
                    variant="contained"
                    onClick={() => { addItem(name); }}>Add</Button>
                  <Button
                    variant="contained"
                    onClick={() => { removeItems(name); }}>Remove</Button>
                </Stack>
              </Box>
            ))
          }
        </Stack>
      </Box>
    </Box>
  );
}
