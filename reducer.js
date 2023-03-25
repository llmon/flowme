import AsyncStorage from '@react-native-async-storage/async-storage';

// node: {nodeID: number, nodeValue: [T], created: 'string' }
const saveNode = async (node) => {
  const jsonValue = JSON.stringify(node);
  await AsyncStorage.setItem('node' + node.nodeID, jsonValue);
};
const saveNextId = async (nextID) => {
  const val = JSON.stringify(nextID);
  await AsyncStorage.setItem('nextID', val);
};

// node --- node --- node --- node ---
//           |       / \
//         node   node node
//          |           |
//        node        node

// state: {river: [node], nextID: number}
export default function reducer(state, action) {
  switch (action.kind) {
    case 'loaded': {
      return {
        ...action.payload,
      };
    }
    case 'create': {
      // just allocate id
      saveNextId(state.nextID + 1);
      return {
        ...state,
        nextID: state.nextID + 1,
      };
    }
    case 'update': {
      const { nodeID } = action.payload;
      const idx = state.river.findIndex((item) => item.nodeID === nodeID);

      // continue 'create'
      if (idx === -1) {
        const now = new Date();
        const [month, day, year] = [
          now.getMonth(),
          now.getDate(),
          now.getFullYear(),
        ];
        const [hour, minutes] = [now.getHours(), now.getMinutes()];
        const node = {
          ...action.payload,
          created: {
            month,
            day,
            year,
            hour,
            minutes,
          },
        };

        saveNode(node);
        return {
          ...state,
          river: [...state.river, node],
        };
      } else {
        const newRiver = state.river.slice();
        newRiver[idx] = {
          ...newRiver[idx],
          nodeValue: action.payload.nodeValue,
        };

        saveNode(newRiver[idx]);
        return {
          ...state,
          river: newRiver,
        };
      }
    }
    case 'delete': {
      const { nodeID } = action.payload;
      AsyncStorage.removeItem('node' + nodeID);
      return {
        ...state,
        river: state.river.filter((item) => item.nodeID !== nodeID),
      };
    }
    case 'star': {
      const { nodeID, star } = action.payload;
      const idx = state.river.findIndex((item) => item.nodeID === nodeID);
      const newRiver = state.river.slice();
      newRiver[idx] = {
        ...newRiver[idx],
        star,
      };
      saveNode(newRiver[idx]);
      return {
        ...state,
        river: newRiver,
      };
    }
  }
}
