import React, {FC, useEffect, useState} from 'react';
import {PageContainer} from "../../components/containers/PageContainer";
import {Table, Form} from 'react-bootstrap';
import {Exercise} from "tlm-common";
import {Link, useHistory} from "react-router-dom";
import {useExercises} from "../../hooks/useExercises";
import {BadgesFromArray} from "../../components/badges/BadgesfromArray";
import {GoogleCloudImg} from "../../components/images/GoogleCloudImg";
import { toast } from 'react-toastify';
import {FaPlusCircle} from "react-icons/fa";
import {VerticalGap} from "../../components/layout/VerticalGap";
import { hashMapFilterFactory } from '@bertco/mak-common';

const ff = hashMapFilterFactory({
  fieldsOfInterest: ['name', 'movementPattern', 'description', 'title'],

});

export const ExerciseListPage: FC = () => {

  const { exercises, loading, error } = useExercises();
  const [search, setSearch] = useState('');
  const history = useHistory();

  useEffect(()=> {
    if (error!==null) {
      toast(error!.message, { type: toast.TYPE.ERROR })
    }
  }, [error])

  const buildRow = (exercise: Exercise) => {
    const completePre = (exercise.prenatalThumb.name && exercise.prenatalVideo.name);
    const completePost =  (exercise.postnatalThumb.name && exercise.postnatalVideo.name);
    const completeAll = completePost && completePre;
    let color;
    if (completeAll) {
      color = 'transparent';
    } else if (completePre) {
      color = '#d4bdfa';
    } else if (completePost) {
      color = '#bde9fa';
    } else {
      color = '#ff8b8b';
    }

    return (
      <tr onClick={()=>history.push(`/exercises/detail/${exercise.docId}`)} style={{backgroundColor: color}}>
        <td><GoogleCloudImg meta={exercise?.prenatalThumb} style={{width: '100px'}} noGap={true}/>
        </td>
        <td>{exercise.title}</td>
        <td>{exercise.movementPattern}</td>
        <td>
          <BadgesFromArray data={exercise.stress}/>
        </td>
        <td><BadgesFromArray data={exercise.activates}/></td>
        <td><BadgesFromArray data={exercise.releases}/></td>
      </tr>
    );
  }

  //const filteredExercises = exercises.filter( e => e.name.toLowerCase().includes(search.toLowerCase()))
  const filteredExercises = exercises.filter( ff(search));

  return (
    <PageContainer title="Exercises" loading={loading}>
      <Form.Group>
        <Form.Control type="text" placeholder="search" onChange={event => {
          setSearch(event.target.value)
        }} value={search}/>
      </Form.Group>
      <Link to="/exercises/edit/new"><FaPlusCircle/> Add new exercise</Link>
      <VerticalGap gapSize={10}/>
      {exercises.length ? <div>
        <Table striped bordered hover>
          <thead>
          <tr>
            <th>Thumb</th>
            <th>Name</th>
            <th>Movement Pattern</th>
            <th>Stress</th>
            <th>Activates</th>
            <th>Releases</th>
          </tr>
          </thead>
          <tbody>
          {filteredExercises.map(buildRow)}
          </tbody>
        </Table>
      </div> : <p className="text-muted font-italic">No exercises found.</p>}
    </PageContainer>
  );
};
