<?php

class Membership_model extends CI_Model {

	function validate()
	{
		$this->db->where('user_email', $this->input->post('user_email'));
		$this->db->where('user_pass', md5($this->input->post('user_pass')));
		$query = $this->db->get('users');
		
		if($query->num_rows == 1)
		{
			return true;
		}
		
	}
	
	function register()
	{
		
		$new_member_insert_data = array(
		//set up now where first string is db feild 2nd string is form id
			'name' => $this->input->post('name'),
			'user_pass' => md5($this->input->post('user_pass')),					
			'user_email' => $this->input->post('user_email')		
		);
		
		
		$insert = $this->db->insert('users', $new_member_insert_data);
		return $insert;
	}
}