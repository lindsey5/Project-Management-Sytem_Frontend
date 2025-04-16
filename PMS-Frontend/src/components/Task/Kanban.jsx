import { StatusChip } from "../chip"
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Card from "../card";
import { useContext, useState } from "react";
import { ProjectContext } from "../../layouts/ProjectLayout";

const status = {
    "To Do" : " #951ff7",
    "In Progress" : " #e2f069",
    "In Review" : " #194bd3",
    "Completed" : " #10B981",
    "Error" : " #F87171" 
  }

const Board = () => {
    

}

const StatusHeader = ({currentStatus, ...rest}) => {
    return <div className="flex items-center justify-between flex-1" {...rest}>
        <StatusChip 
            label={currentStatus}
            color={status[currentStatus]}
            sx={{fontSize: '15px', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: 'white'}}
        />
        <IconButton aria-label="delete" size="small" sx={{backgroundColor: 'white'}}>
            <AddIcon fontSize="inherit" sx={{ color: '#2328ff'}}/>
        </IconButton>
    </div>
}

const Kanban = () => {
    const [cards, setCards] = useState([
      { id: 1, status: 'To Do' },
      { id: 2, status: 'To Do' },
      { id: 3, status: 'In Progress' },
      { id: 4, status: 'Error' },
      { id: 5, status: 'In Review' }
    ]);
    const [loading, setLoading] = useState(false); 
    const { role } = useContext(ProjectContext);
  
    const handleDragStart = (e, cardId) => {
      e.dataTransfer.setData('cardId', cardId);
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
    };
  
    const handleDrop = async (e, newStatus) => {
      e.preventDefault();
      const cardId = parseInt(e.dataTransfer.getData('cardId'));
      
      setLoading(true); 
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCards(cards.map(card => 
        card.id === cardId ? { ...card, status: newStatus } : card
      ));
      
      setLoading(false); 
    };
  
    const statuses = ['To Do', 'In Progress', 'In Review', 'Error', 'Completed'];
  
    return (
      <div className="p-3 min-w-[1080px] relative">
        <div className="grid grid-cols-5 gap-3 border-b-1 border-gray-300 py-3">
          {statuses.map(status => (
            <StatusHeader key={status} currentStatus={status} />
          ))}
        </div>
        <div className="grid grid-cols-5 py-3 box-border">
          {statuses.map(status => (
            <div 
              key={status}
              className="min-h-[200px]"
              onDragOver={role === 'Admin' && handleDragOver}
              onDrop={(e) => role === 'Admin' && handleDrop(e, status)}
            >
              {cards
                .filter(card => card.status === status)
                .map(card => (
                    <Card 
                    key={card.id}
                    className={`bg-white m-3 ${role === 'Admin' && 'cursor-pointer'}`}
                    draggable={!loading && role === 'Admin'}
                    onDragStart={(e) => role === 'Admin' && handleDragStart(e, card.id)}
                  />
                ))
              }
            </div>
          ))}
        </div>
      </div>
    );
};

export default Kanban