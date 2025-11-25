import React, {FC, useEffect, useState} from 'react';
import {Button, ButtonGroup, Col, Container, Form, Modal, Nav, Row, Tabs, Tab, ToggleButton} from "react-bootstrap";
import {BARE_CUSTOM_EXERCISE, BREAK_EXERCISE, Exercise, WorkoutType, Workout} from "tlm-common";
import {ExerciseCard} from "../../../components/cards/ExerciseCardHz";
import {useExercises} from "../../../hooks/useExercises";
import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";
import * as api from '../../../services/api';
import {toast} from "react-toastify";
import {BsFillTrashFill, BsPlusCircle} from 'react-icons/bs';
import {PreviewModal} from "../../../components/modals/PreviewModal";
import {TitleAndTextAreaModal} from "../../../components/modals/TitleAndTextAreaModal";
import {PrebuiltWorkoutPicker} from "./PrebuiltWorkoutPicker";
import {OKCancelModal} from "../../../components/modals/OKCancelModal";

interface UniqueExercise extends Exercise {
  uuid: string;
}

// oy, this is here because some exercises use underbars and cap letters. So, here we are.
const sortStrings = (a: string, b: string) => {
  const _a = a.replace(/[-_]/gm, ' ').toLowerCase();
  const _b = b.replace(/[-_]/gm, ' ').toLowerCase();
  if (_a === _b) return 0;
  return _a > _b ? 1 : -1;
};

interface Props {
  initialExercises?: Exercise[];
  onChange: (es: Exercise[]) => void;
  onWorkoutTypeChange: (workoutType: WorkoutType) => void;
  workoutType: WorkoutType;
  onPrebuiltPicked?: (workout: Workout) => void;
}

export const WorkoutAssembler: FC<Props> = ({initialExercises = [], onChange, onWorkoutTypeChange, workoutType, onPrebuiltPicked}) => {
  const {legitExercises: allEx, movementPatterns} = useExercises();
  const [filter, setFilter] = useState('');
  const [mpFilter, setMpFilter] = useState('all');
  const [addNoteTo, setAddNoteTo] = useState(-1);
  const [noteBeingEdited, setNoteBeingEdited] = useState('');
  const [droppedEs, setDroppedEs] = useState<UniqueExercise[]>([]);
  const [deleted, setDeleted] = useState<UniqueExercise[]>([]);
  const [showPreview, setShowPreview] = useState<Exercise | undefined>();
  const [showCustomExModal, setShowCustomExModal] = useState(false);
  const [pickedPBWorkout, setPickedPBWorkout] = useState<Workout|undefined>(undefined);

  useEffect(() => {
    if (initialExercises?.length > 0) {
      const initialEs = initialExercises.map(e => ({
        ...e,
        uuid: api.helpers.UUIDWith(e.docId)
      }));
      setDroppedEs(initialEs);
    }
  }, [initialExercises])

  const exercises = [BREAK_EXERCISE, ...allEx.sort((a, b) => sortStrings(a.name, b.name))
  ];
  const filteredExercises = exercises.filter(e => {
    if (filter.length < 2) return true;
    return e.name.toLowerCase().includes(filter.toLowerCase());
  })

  const mpArray = Array.from(movementPatterns);

  const handleOnDragEnd = (result: DropResult) => {
    const {destination, source} = result;
    const reorderedE = [...droppedEs];

    if (!destination) return;

    if (destination.droppableId === 'trash') {
      // deletes exercises dropped overboard
      console.log('Deleting exercise at: ' + source.index);
      setDeleted(reorderedE.splice(source.index, 1));
      setDroppedEs(reorderedE)
      onChange(reorderedE);
      toast.warn('Exercise removed from workout');
      // remove after animation
      setTimeout(() => setDeleted([]), 350);
    } else {
      const [reorderedEx] = reorderedE.splice(source.index, 1);
      reorderedE.splice(destination.index, 0, reorderedEx);
      onChange(reorderedE);
      setDroppedEs(reorderedE);
    }

  }

  const handleAddExercise = (exercise: Exercise) => {
    const newEs = [...droppedEs, {...exercise, uuid: api.helpers.UUIDWith(exercise.docId)}];
    onChange(newEs);
    setDroppedEs(newEs);
    setFilter('');
  }

  const handleAddCustomExercise = (name: string, description: string) => {
    console.log(`Adding ${name} -> ${description}`);
    const custom = {...BARE_CUSTOM_EXERCISE, name: name, description, title: name};
    handleAddExercise(custom);
  }

  const patternFiltered = filteredExercises.filter(e => {
    if (mpFilter === 'all') return true;
    return e.movementPattern === mpFilter;
  });

  const exerciseCards = patternFiltered
    .map((e, idx) =>
      <ExerciseCard
        exercise={e}
        onDoubleClick={handleAddExercise}
        onLongPress={(e) => setShowPreview(e)}
        key={e.name}/>
    );

  const addExerciseNotes = (idx: number) => {
    console.log(`Editing...${idx}`);
    const note = droppedEs[idx].clientNotes || '';
    setNoteBeingEdited(note);
    setAddNoteTo(idx);
  }

  const saveExerciseNotes = () => {
    const newDroppedEs = [...droppedEs];
    newDroppedEs[addNoteTo].clientNotes = noteBeingEdited;
    onChange(newDroppedEs);
    setDroppedEs(newDroppedEs);
    setNoteBeingEdited('');
    setAddNoteTo(-1);
  }

  const handlePrebuiltPicked = (workout: Workout) => {
    setPickedPBWorkout(workout);
  }

  const handlePrebuiltConfirmed = () => {
    if (onPrebuiltPicked) {
      onPrebuiltPicked(pickedPBWorkout!);
      setPickedPBWorkout(undefined);
    }
  }

  const filteredMpArray = mpArray.filter(mp => filteredExercises.some(e => e.movementPattern === mp));

  return (
    <Container fluid>
      <Row>
        <Col sm={12} md={2}>
          <Form.Control type="text" value={filter}
                        onChange={(ev) => setFilter(ev.target.value)}
                        placeholder="Search..."
                        className="mb-2"/>
          <Nav variant="pills" className="flex-column" defaultActiveKey="all">
            <Nav.Item>
              <Nav.Link eventKey="all" onSelect={k => setMpFilter(k as string)}>all</Nav.Link>
            </Nav.Item>
            {filteredMpArray.map(mp => {
              return (
                <Nav.Item key={mp}>
                  <Nav.Link eventKey={mp} onSelect={k => setMpFilter(k as string)}>{mp}</Nav.Link>
                </Nav.Item>
              )
            })}
          </Nav>
        </Col>
        <Col>
          <Tabs>
            <Tab eventKey="exercises" title="Exercises" tabClassName="h5">
              {/*<h5>Exercises</h5>*/}
              <div className="overflow-auto" style={{height: 800}}>
                <p className="text-muted font-italic mt-3" style={{fontSize: 12, textAlign: 'center'}}>Double click an exercise
                  to add to workout, Long press for a preview.</p>
                <Button size="sm" onClick={() => setShowCustomExModal(true)} variant="primary"
                        className="w-75 d-block m-auto"><BsPlusCircle className="mr-3"/> Add Custom Exercise</Button>
                <hr/>
                {exerciseCards}
              </div>
            </Tab>
            <Tab eventKey="prebuilt" title="Pre-Built Workouts" tabClassName="h5">
              <PrebuiltWorkoutPicker onWorkoutPicked={handlePrebuiltPicked}/>
            </Tab>
          </Tabs>
        </Col>
        <Col>
          <h5>Workout</h5>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId={"trash"}>
              {(provided) => (
                <div
                  className="w-100 mb-2 text-muted"
                  {...provided.droppableProps} ref={provided.innerRef}
                  style={{backgroundColor: '#ffb0b0'}}>
                  <p className="text-muted text-center p-1 text-sm-center w-100 font-italic" style={{fontSize: 12}}>drag
                    exercises
                    here to delete<BsFillTrashFill className="float-right pt-1"/></p>
                  {deleted.map((e, idx) => {
                    return (<Draggable draggableId={e.uuid} index={idx} key={e.uuid}>
                      {(provided) => (
                        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                          <ExerciseCard exercise={e} deleting={true}/></div>)}
                    </Draggable>);
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <ButtonGroup toggle className="w-100" size="sm">
              <ToggleButton
                className={`w-50 mb-2 ${workoutType === WorkoutType.normal ? "font-weight-bolder animate__animated animate__headShake" : ""}`}
                type="radio"
                name="radio"
                value={WorkoutType.normal}
                checked={workoutType === WorkoutType.normal}
                onChange={(e) => onWorkoutTypeChange(WorkoutType.normal)}
              >
                Normal
              </ToggleButton>
              <ToggleButton
                className={`w-50 mb-2 ${workoutType === WorkoutType.mobility ? "font-weight-bolder animate__animated animate__headShake" : ""}`}
                type="radio"
                name="radio"
                value={WorkoutType.mobility}
                checked={workoutType === WorkoutType.mobility}
                onChange={(e) => onWorkoutTypeChange(WorkoutType.mobility)}
              >
                Mobility
              </ToggleButton>
            </ButtonGroup>
            <div className="overflow-auto" style={{height: 700}}>
              <Droppable droppableId={'workout'}>
                {(provided) => (
                  <div
                    className="w-100 h-100"
                    {...provided.droppableProps} ref={provided.innerRef}
                    style={{border: '2px solid #c0c0c0', backgroundColor: '#eeeeee'}}>
                    {droppedEs.map((e, idx) => {
                      return (<Draggable draggableId={e.uuid} index={idx} key={e.uuid}>
                        {(provided) => (
                          <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                            <ExerciseCard exercise={e} onAddNotes={() => addExerciseNotes(idx)}/></div>)}
                      </Draggable>);
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        </Col>
      </Row>
      <Modal show={addNoteTo > -1} onHide={() => setAddNoteTo(-1)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Exercise Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Add a note for this exercise. Stuff like reps, weights, you get it.</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              onChange={e => setNoteBeingEdited(e.target.value)}
              value={noteBeingEdited}/>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAddNoteTo(-1)}>
            I Got Nothing
          </Button>
          <Button variant="danger" onClick={saveExerciseNotes}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <PreviewModal title={'Exercise Preview'}
                    buttonTitle="I've Seen Enough"
                    show={!!showPreview}
                    onClose={() => setShowPreview(undefined)}
                    exercise={showPreview!}/>
      <TitleAndTextAreaModal modalTitle="Add Custom Exercise"
                             titleInputLabel="Name your custom exercise"
                             textareaLabel={`You're going to want to add some instructions below, otherwise your client's just gonna watch Netflix.`}
                             onSave={handleAddCustomExercise}
                             show={showCustomExModal}
                             onClose={() => setShowCustomExModal(false)}/>
                             <OKCancelModal title="Use Pre-Built Workout?"
                                            body={`If you select ${pickedPBWorkout?.name}, it will replace all your current work. You cool with that?`}
                                            show={!!pickedPBWorkout}
                                            onOK={handlePrebuiltConfirmed}
                                            okButtonTitle="I'm Down"
                                            onCancel={()=>setPickedPBWorkout(undefined)}/>

    </Container>

  );
};
