import { Box } from "@material-ui/core";
import React, { memo } from "react";
import Person from "./Person";

const Persons = memo(({ persons, handleEditPerson }) => {
  return (
    <Box sx={{ padding: "0 30px" }}>
      {persons.map((person) => (
        <Person
          key={person.uid}
          person={person}
          handleEditPerson={handleEditPerson}
        />
      ))}
    </Box>
  );
});

export default Persons;