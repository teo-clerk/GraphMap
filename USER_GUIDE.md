# 📘 User Guide - How to Use Graph Creator

## 🎯 Quick Start Guide

### Starting the Application

1. **Open the app** in your browser (http://localhost:5173)
2. You'll see the **Travel & Tourism Ecosystem** graph loaded by default
3. You're in **View Mode** by default (you can explore but not edit)

---

## ✏️ How to Create, Edit, and Delete Nodes

### Step 1: Enter Edit Mode

**🔄 Toggle the Mode Button** at the top of the screen:
- Click the button that says **"👁️ View Mode"**
- It will change to **"✏️ Edit Mode"**
- The edit toolbar will appear with more buttons

### Step 2: Create a New Node

**Method: Using the Add Node Button**

1. **Click the ➕ button** in the toolbar (top of screen)
2. A form will appear with these fields:

   - **Name*** (Required) - The node's label
     - Example: `"Apple Inc."`
   
   - **Segment** - Category or industry
     - Example: `"Technology"`
   
   - **Description** - What this node represents
     - Example: `"Consumer electronics company"`
   
   - **Market Size / Revenue** - Financial data
     - Example: `"$394B revenue (2022)"`
   
   - **Business Model** - How it makes money
     - Example: `"Hardware sales, Services, App Store commission"`
   
   - **Archetypes** - Click to select categories (you can pick multiple)
     - These are the colored categories like "Infrastructure", "Specialists", etc.

3. **Click "Create Node"** when done
4. Your new node will appear on the graph!

### Step 3: Connect Two Nodes
### 2. Connecting Nodes
1.  Ensure you are in **Edit Mode**.
2.  **Method A (Keyboard):** Hold the `Shift` key.
3.  **Method B (Toolbar):** Click the **Connect Mode** button (🔗) in the toolbar to toggle it on.
4.  Click the first node (the source). It will be highlighted in **gold**.
5.  Click the second node (the target).
6.  A connection arrow will appear pointing from the first to the second node.

**Visual Feedback:**
- When you Shift+click the first node, it gets a **gold/yellow border**
- A message appears saying "Shift+Click another node to create connection"
- After clicking the second node, the connection is created

**Example:**
```
Goal: Connect "Google" to "YouTube"
1. Shift + Click "Google" → (gold border appears)
2. Shift + Click "YouTube" → Connection created!
```

### Step 4: Edit an Existing Node

**Method 1: Right-Click Menu**

1. **Right-click** on any node in Edit Mode
2. Select **"✏️ Edit Node"** from the menu
3. The node form opens with current data pre-filled
4. Make your changes
5. Click **"Update Node"**

**Method 2: Click then Edit**
1. Click a node to select it
2. Look at the InfoPanel on the right
3. Right-click the node → Edit Node

### Step 5: Delete a Node

**Method 1: Right-Click Menu**

1. **Right-click** on the node you want to delete
2. Select **"🗑️ Delete Node"**
3. Confirm the deletion
4. The node and all its connections will be removed

**⚠️ Warning:** Deleting a node also removes all connections to/from it!

### Step 6: Delete a Connection

**Method: Right-Click on the Line**

1. In Edit Mode, **right-click directly on a connection line** (arrow)
2. A confirmation dialog appears
3. Click **OK** to delete
4. The connection is removed (nodes remain)

---

## 🎨 Managing Archetypes (Categories)

### What are Archetypes?

Archetypes are **color-coded categories** for your nodes. Think of them like tags or labels. Examples:
- "Technology Companies" (blue)
- "Service Providers" (green)
- "Infrastructure" (purple)

### Creating Custom Archetypes

1. Click the **🎨 button** in the toolbar
2. Click **"➕ Add New Archetype"**
3. Fill in:
   - **Name**: The category name
   - **Color**: Click the color picker to choose
   - **Description**: What this category represents
4. Click **"Add Archetype"**

### Using Archetypes

When creating or editing a node:
- Click on archetype tags to select/deselect them
- A node can have **multiple archetypes**
- The node's color will be the first selected archetype's color

---

## 💾 Saving Your Work

### Auto-Save vs Manual Save

**Auto-Save:**
- Happens automatically when you make changes
- Stored in your **browser's localStorage**
- Persists between sessions

**Manual Save:**
1. Click the **💾 "Save to Browser"** button
2. Notification appears confirming save
3. Your graph is now in localStorage

### Understanding LocalStorage

**What it is:**
- A small database built into your browser
- Stores data on YOUR computer only
- Survives browser restarts
- Limited to ~5-10MB

**Limitations:**
- Only available on the same browser/device
- Clearing browser data erases it
- Not shared across devices

**💡 Solution:** Use Export (📤) to save a backup file!

---

## 📤 Export & 📥 Import

### Exporting Your Graph

**What it does:** Downloads a `.json` file of your entire graph to your computer

**Steps:**
1. Click **📤 "Save as JSON File"** button
2. A file downloads (e.g., `travel_ecosystem.json`)
3. Save it somewhere safe (Desktop, Google Drive, etc.)

**When to use:**
- ✅ Backup before major changes
- ✅ Share graph with collaborators
- ✅ Switch between devices
- ✅ Version control (keep multiple versions)

### Importing a Graph

**⚠️ Current Status:** Import button shows "Coming Soon" message

**How it WILL work (when enabled):**
1. Click **📥 "Import JSON"** button
2. Select a `.json` file from your computer
3. The graph loads

**For now:** Use the **Share Link** feature instead (🔗)

---

## 🔗 Sharing Your Graph

### How Sharing Works

Instead of uploading to a server, your **entire graph is encoded into the URL**!

**Steps:**
1. Click **🔗 Share** button
2. A modal appears with:
   - A **QR Code** (scan with phone)
   - A **Share Link** (long URL with encoded data)
3. Click **"📋 Copy"** to copy the link
4. Share via email, chat, social media, etc.

**Example Share Link:**
```
https://yoursite.com/#graph=eJyVkMFuwjAMhu9-iqrTtI...
```

The part after `#graph=` is your compressed graph data!

### Opening a Shared Link

1. Simply **open the URL** in a browser
2. The graph loads automatically
3. You can then:
   - View it (View Mode)
   - Edit it (switch to Edit Mode)
   - Save it to your localStorage
   - Export it as JSON

**🔒 Privacy:** The data is in the URL, not on a server. Only people with the link can access it.

---

## 📋 JSON Format for Import/Export

### Basic Structure

```json
{
  "id": "unique_graph_id",
  "name": "My Graph Name",
  "description": "What this graph is about",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T14:45:00.000Z",
  "archetypes": [...],
  "nodes": [...],
  "links": [...]
}
```

### Complete Example

```json
{
  "id": "graph_1234567890_abc123",
  "name": "Tech Companies Network",
  "description": "Major tech companies and their relationships",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T14:45:00.000Z",
  
  "archetypes": [
    {
      "id": "arch1",
      "name": "Social Media",
      "color": "#4267B2",
      "description": "Companies focused on social networking"
    },
    {
      "id": "arch2",
      "name": "E-Commerce",
      "color": "#FF9900",
      "description": "Online retail and marketplace platforms"
    }
  ],
  
  "nodes": [
    {
      "id": "P001",
      "name": "Facebook",
      "segment": "Social Media",
      "archetype": ["arch1"],
      "color": "#4267B2",
      "description": "Social networking platform",
      "market_size": "$116B revenue (2022)",
      "business_model": "Advertising, data analytics",
      "outbound": ["P002", "P003"],
      "inbound": []
    },
    {
      "id": "P002",
      "name": "Instagram",
      "segment": "Social Media",
      "archetype": ["arch1"],
      "color": "#4267B2",
      "description": "Photo and video sharing app",
      "market_size": "Owned by Meta",
      "business_model": "Advertising",
      "outbound": [],
      "inbound": ["P001"]
    },
    {
      "id": "P003",
      "name": "WhatsApp",
      "segment": "Messaging",
      "archetype": ["arch1"],
      "color": "#4267B2",
      "description": "Messaging application",
      "market_size": "Owned by Meta",
      "business_model": "Business API, future advertising",
      "outbound": [],
      "inbound": ["P001"]
    }
  ],
  
  "links": [
    {
      "source": "P001",
      "target": "P002",
      "type": "outbound"
    },
    {
      "source": "P001",
      "target": "P003",
      "type": "outbound"
    }
  ]
}
```

### Field Descriptions

#### Graph Level
- **id**: Unique identifier (auto-generated)
- **name**: Display name of your graph
- **description**: What the graph represents
- **createdAt** / **updatedAt**: ISO 8601 timestamps

#### Archetype Object
- **id**: Unique ID like "arch1", "arch2"
- **name**: Display name
- **color**: Hex color code (e.g., "#FF5733")
- **description**: What this archetype represents

#### Node Object
- **id**: Unique identifier (e.g., "P001", "P002")
  - Convention: P + 3-digit number
- **name**: Display name (Required)
- **segment**: Category or industry
- **archetype**: Array of archetype IDs (e.g., ["arch1", "arch2"])
- **color**: Hex color (usually matches first archetype)
- **description**: Detailed description
- **market_size**: Revenue, market cap, or size metric
- **business_model**: How it makes money
- **outbound**: Array of node IDs this connects TO
- **inbound**: Array of node IDs that connect FROM
- **x**, **y**: Optional position (auto-calculated if omitted)

#### Link Object
- **source**: ID of source node (or node object)
- **target**: ID of target node (or node object)
- **type**: Usually "outbound"

### Creating Your Own JSON

**Option 1: Export and Modify**
1. Create a graph in the app
2. Export it
3. Open the JSON file in a text editor
4. Modify it
5. Import it back

**Option 2: Write from Scratch**
1. Copy the template above
2. Replace the data
3. Make sure IDs are unique
4. Save as `.json` file

### JSON Validation Checklist

✅ All nodes have unique IDs
✅ Archetype IDs in nodes match actual archetype IDs
✅ Source/target in links match node IDs
✅ Colors are valid hex codes (#RRGGBB)
✅ outbound/inbound arrays match the links
✅ No trailing commas
✅ Valid JSON syntax (use jsonlint.com to check)

---

## 🤖 Using the AI Assistant

### Setup (One Time)

1. **Get API Key:**
   - Visit https://makersuite.google.com/app/apikey
   - Sign in with Google account
   - Click "Create API Key"
   - Copy the key

2. **Enter API Key:**
   - Click the **🤖 floating button** (bottom right)
   - Paste your API key
   - Click "Save API Key"
   - It's stored securely in your browser

### Asking Questions

**Click the 🤖 button** and try questions like:

**Graph Structure:**
- "How many nodes are in this graph?"
- "What are the most connected nodes?"
- "Which nodes have no connections?"

**Insights:**
- "What are the main hubs in this ecosystem?"
- "Identify central players"
- "What patterns do you see?"

**Specific Queries:**
- "Tell me about [node name]"
- "What connects [node A] to [node B]?"
- "Who are the competitors of [company]?"

**Analysis:**
- "Explain the different archetypes"
- "What does this graph reveal about the industry?"
- "Suggest potential new connections"

### AI Limitations

- The AI sees a **snapshot** of your graph (not live updates)
- Limited to ~50 nodes in the prompt (performance)
- Can't directly edit the graph (yet!)
- Requires internet connection

---

## 💡 Tips & Best Practices

### Organizing Your Graph

1. **Use Clear Names**: "Apple Inc." not "apple" or "APPL"
2. **Consistent Segments**: Pick standard categories
3. **Meaningful Archetypes**: Make them descriptive
4. **Add Descriptions**: Future you will thank you
5. **Include Data**: Market size helps with context

### Managing Large Graphs

- **Use Search**: Type names to filter
- **Use Archetype Filters**: Focus on one category at a time
- **Zoom and Pan**: Use mouse wheel + drag
- **Delete Unused Nodes**: Keep it clean

### Backup Strategy

1. **Weekly Exports**: Download JSON backups
2. **Version Names**: e.g., `my_graph_v1.json`, `my_graph_v2.json`
3. **Cloud Storage**: Keep JSONs in Google Drive or Dropbox
4. **Before Major Changes**: Always export first!

### Performance

- **100+ nodes**: May start to slow down
- **500+ nodes**: Consider splitting into multiple graphs
- **Complex layouts**: Let the force simulation settle before editing

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Shift + Click` | Create connection between nodes |
| `Right Click` | Open context menu (Edit Mode) |
| `Mouse Wheel` | Zoom in/out |
| `Click + Drag (background)` | Pan around |
| `Click + Drag (node)` | Move node |

---

## ❓ Common Issues & Solutions

### "My node disappeared!"

**Cause:** The force simulation pushed it off-screen

**Solution:**
- Zoom out (mouse wheel down)
- Use Search to find it by name
- Check if a filter is active

### "I can't connect two nodes"

**Checklist:**
- ✅ Are you in Edit Mode?
- ✅ Did you hold Shift while clicking?
- ✅ Did you click the first node (gold border)?
- ✅ Did you then click the second node?

### "My graph isn't saving"

**Check:**
- LocalStorage might be disabled in your browser
- Browser might be in Private/Incognito mode
- Try clicking 💾 manually
- Export as JSON as backup

### "Share link is too long"

**Why:** Large graphs create very long URLs

**Solutions:**
- Export as JSON and share the file instead
- Use a URL shortener (bit.ly, tinyurl.com)
- Upload JSON to GitHub Gist and share that link

### "Import button doesn't work"

**Status:** Import is currently disabled

**Workarounds:**
- Use Share links instead (🔗)
- Manually edit localStorage (advanced)
- Wait for import feature completion

---

## 🎓 Learning Resources

### Video Tutorials (Coming Soon)
- Creating your first graph
- Advanced editing techniques
- Exporting and sharing
- Using the AI assistant

### Example Graphs

Try these to learn:
1. **Social Network**: Friends and their connections
2. **Project Dependencies**: Tasks and prerequisites
3. **Knowledge Map**: Concepts and relationships
4. **Organization Chart**: People and reporting structure

### Community

- Share your graphs on social media with #GraphCreator
- Join discussions (link to Discord/Forum)
- Submit feedback and feature requests

---

## 📞 Need Help?

- **📚 Documentation**: Check README.md and BEGINNERS_GUIDE.md
- **🐛 Found a bug?**: Report it on GitHub Issues
- **💡 Feature idea?**: We'd love to hear it!
- **📧 Email**: your-email@example.com

---

**Happy Graph Creating!** 🎉

*Last updated: January 2024*
