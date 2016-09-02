# {{ role }}

Master: [![Build Status](https://travis-ci.org/ansible-city/{{ role }}.svg?branch=master)](https://travis-ci.org/ansible-city/{{ role }})  
Develop: [![Build Status](https://travis-ci.org/ansible-city/{{ role }}.svg?branch=develop)](https://travis-ci.org/ansible-city/{{ role }})




## ansible.cfg

This role is designed to work with merge "hash_behaviour". Make sure your
ansible.cfg contains these settings

```INI
[defaults]
hash_behaviour = merge
```




## Installation and Dependencies

This role has no dependencies




## Tags

This role uses two tags: **build** and **configure**

* `build` - Installs composer.
* `configure` - Configures composer.




## Examples

```YAML
- name: Simple Example
  hosts: sandbox

  roles:
    - role: ansible-city.{{ role }}
      {{ role }}:
        ...
```
